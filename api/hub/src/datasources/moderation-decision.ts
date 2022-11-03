import { DataSource } from 'apollo-datasource';
import { getAppDB, logger, encodeString, decodeString, sendAuthorNotification } from '../helpers';
import { Client, ThreadID, Where } from '@textile/hub';
import { ModerationDecision, ModerationReason, ModerationReport } from '../collections/interfaces';
import PostsAPI from './post';
import ProfileAPI from './profile';
import ModerationReportAPI from './moderation-report';
import { queryCache } from '../storage/cache';
import { parse, stringify } from 'flatted';
import CommentAPI from './comment';

/**
 * The ModerationDecisionAPI class handles all the interactions between the
 * moderation decisions API and the underlying storage layer.
 */
class ModerationDecisionAPI extends DataSource {
  private readonly collection: string;
  private context;
  private readonly dbID: ThreadID;
  constructor({ collection, dbID }) {
    super();
    this.collection = collection;
    this.dbID = dbID;
  }

  async initialize(config) {
    this.context = config.context;
  }

  /**
   * Get the name of the key for decisions cache.
   * @param contentID - The content identifier
   * @returns The key as a string
   */
  getDecisionCacheKey(contentID: string) {
    return `${this.collection}:contentID${contentID}`;
  }

  /**
   * Get the name of the key for moderated decisions cache.
   * @param contentID - The content identifier
   * @returns The key as a string
   */
  getModeratedDecisionCacheKey(contentID: string) {
    return `${this.collection}:moderated:contentID${contentID}`;
  }

  /**
   * Get the name of the key for counters cache
   * @returns The key as a string
   */
  getCountersCacheKey() {
    return `${this.collection}:counters`;
  }

  /**
   * Get the name of the key for list of pending items cache
   * @returns The key as a string
   */
  getPendingListCacheKey() {
    return `${this.collection}:pending`;
  }

  /**
   * Get the name of the key for list of moderated items cache
   * @returns The key as a string
   */
  getModeratedListCacheKey() {
    return `${this.collection}:moderated`;
  }

  /**
   * Return current moderation status for a list of given content IDs.
   * @param user - The current user
   * @param contentIDs - The list of content IDs to check
   * @param decisionsAPI - The decisions API object
   * @param reportingAPI - The reporting API object
   * @returns A list of statuses for each content ID requested
   */
  async getModerationStatus(
    user: string,
    contentIDs: [string],
    decisionsAPI: ModerationDecisionAPI,
    reportingAPI: ModerationReportAPI,
  ) {
    const statuses = [];
    for (const contentID of contentIDs) {
      const status = {
        contentId: contentID,
        reported: false,
        moderated: false,
        delisted: false,
        reason: '',
      };
      // get decision for the current contentID
      const decision = await decisionsAPI.getDecision(contentID);
      if (decision) {
        status.moderated = decision.moderated;
        status.delisted = decision.delisted;
        // check if the current logged user has already reported this content
        if (user) {
          const reported = await reportingAPI.getReport(contentID, user);
          if (reported) {
            status.reported = true;
            status.reason = reported.reason;
          }
        }
      }
      statuses.push(status);
    }
    return statuses;
  }

  /**
   * List the moderation actions log for each content identifier.
   * @param contentID - The content identifier
   * @returns A list of ModerationDecision objects
   */
  async listActions(contentID: string) {
    const decision = parse(stringify(await this.getDecision(contentID)));
    if (decision.actions && decision.actions.length) {
      decision.actions.forEach((element, index) => {
        element.explanation = decodeString(element.explanation);
        decision.actions[index] = element;
      });
    }
    return decision;
  }

  /**
   * Count all decisions (pending, moderated and delisted, moderated and kept).
   * @returns An object with all three counters
   * @example Getting all counters
   * ```typescript
   * const count = await countDecisions();
   * console.log(count); // { pending: 10, delisted: 1, kept: 3 }
   * ```
   */
  async countDecisions() {
    const countersCache = this.getCountersCacheKey();
    if (await queryCache.has(countersCache)) {
      return queryCache.get(countersCache);
    }

    // pending
    const db: Client = await getAppDB();
    let query = new Where('moderated').eq(false);
    let results = await db.find<ModerationDecision>(this.dbID, this.collection, query);
    const pending = results.length;
    // delisted
    query = new Where('moderated').eq(true).and('delisted').eq(true);
    results = await db.find<ModerationDecision>(this.dbID, this.collection, query);
    const delisted = results.length;
    // kept
    query = new Where('moderated').eq(true).and('delisted').eq(false);
    results = await db.find<ModerationDecision>(this.dbID, this.collection, query);
    const kept = results.length;
    const counters = {
      pending,
      delisted,
      kept,
    };
    await queryCache.set(countersCache, counters);
    return counters;
  }

  /**
   * Get a single decision based on the provided content identifier.
   * @param contentID - The content identifier
   * @returns A ModerationDecision object
   */
  async getDecision(contentID: string): Promise<ModerationDecision | undefined> {
    const decisionCache = this.getDecisionCacheKey(contentID);
    if (!contentID) {
      throw new Error('Must provide a resource id!');
    }
    if (await queryCache.has(decisionCache)) {
      return queryCache.get<ModerationDecision>(decisionCache);
    }
    const db: Client = await getAppDB();
    const query = new Where('contentID').eq(contentID);
    const decisions = await db.find<ModerationDecision>(this.dbID, this.collection, query);
    if (decisions.length) {
      decisions[0].explanation = decodeString(decisions[0].explanation);
      await queryCache.set(decisionCache, decisions[0]);
      return decisions[0];
    }
    await queryCache.set(decisionCache, undefined);
    logger.warn(`[moderation-decision]: Could not find decision for ${contentID}!`);
    return undefined;
  }

  /**
   * Get a list of decisions based on their status (delisted and/or moderated).
   * @param profileAPI - The profile data source API
   * @param reportingAPI - The reporting data source API
   * @param delisted - The delisted status (boolean)
   * @param moderated - The moderated status (boolean)
   * @param offset - The offset ID
   * @param limit - The limit of results to return
   * @returns A list of decisions
   */
  async getDecisions(
    profileAPI: ProfileAPI,
    reportingAPI: ModerationReportAPI,
    delisted: boolean,
    moderated: boolean,
    offset?: string,
    limit?: number,
  ) {
    const decisions = await this.listDecisions(delisted, moderated, offset, limit);
    const list = [];
    for (const decision of decisions.results) {
      // get the full data for each decision
      const decisionContent = await this.getFinalDecision(
        decision.contentID,
        profileAPI,
        reportingAPI,
      );
      if (decisionContent) {
        list.push(decisionContent);
      }
    }
    return { results: list, nextIndex: decisions.nextIndex, total: decisions.total };
  }

  /**
   * List decisions based on provided status (i.e. pending/moderated).
   * @param delisted - Whether it should check for delisted items or not
   * @param moderated - Whether it should check for moderated or not (i.e. pending)
   * @param offset - Offset from the provided identifier
   * @param limit - Limit number of records returned
   * @returns A list of ModerationDecision objects
   */
  async listDecisions(delisted: boolean, moderated: boolean, offset?: string, limit?: number) {
    const db: Client = await getAppDB();
    let list: ModerationDecision[];
    const listType = moderated ? this.getModeratedListCacheKey() : this.getPendingListCacheKey();
    if (await queryCache.has(listType)) {
      list = await queryCache.get<ModerationDecision[]>(listType);
    } else {
      const query = moderated
        ? new Where('moderated').eq(true).orderByDesc('moderatedDate')
        : {
            sort: { desc: true, fieldPath: 'creationDate' },
          };
      list = await db.find<ModerationDecision>(this.dbID, this.collection, query);
      await queryCache.set(listType, list);
    }
    list = list.filter(item => item.delisted === delisted && item.moderated === moderated);
    const offsetIndex = offset ? list.findIndex(item => item._id === offset) : 0;
    let endIndex = (limit || 10) + offsetIndex;
    if (list.length <= endIndex) {
      endIndex = undefined;
    }
    const results = list.slice(offsetIndex, endIndex);
    const nextIndex = endIndex ? list[endIndex]._id : '';
    return { results: results, nextIndex: nextIndex, total: list.length };
  }

  /**
   * Aggregates data for a final decision. It contains profile data for moderator,
   * first report, number of total reports, and full list of reasons it was reported for.
   * @param contentID - The content identifier
   * @param profileAPI - The profile data source API
   * @param reportingAPI
   * @returns An object with all the relevant data
   */
  async getFinalDecision(
    contentID: string,
    profileAPI: ProfileAPI,
    reportingAPI: ModerationReportAPI,
  ): Promise<
    ModerationDecision & { reasons?: ModerationReason[] } & { reports?: ModerationReport[] }
  > {
    const decisionCache = this.getModeratedDecisionCacheKey(contentID);
    if (await queryCache.has(decisionCache)) {
      return queryCache.get<ModerationDecision>(decisionCache);
    }
    const finalDecision = await this.getDecision(contentID);
    // remove action log as it is not needed here
    if (finalDecision?.actions) {
      delete finalDecision.actions;
    }
    // add moderator data
    if (finalDecision?.moderator) {
      const moderator = finalDecision.moderator.startsWith('0x')
        ? await profileAPI.getProfile(finalDecision.moderator)
        : await profileAPI.resolveProfile(finalDecision.moderator);
      Object.assign(finalDecision, {
        moderator: moderator.pubKey,
        moderatorProfile: {
          ethAddress: moderator.ethAddress, // Deprecated, to be removed
          pubKey: moderator.pubKey,
          name: moderator.name || '',
          userName: moderator.userName || '',
          avatar: moderator.avatar || '',
        },
      });
    } else {
      logger.warn(`[moderation]: Could not find moderator for finalDecision ${contentID}!`);
    }
    // add first report data
    const first = await reportingAPI.getFirstReport(contentID);
    const reportedDate = first.creationDate;
    const author = first.author.startsWith('0x')
      ? await profileAPI.getProfile(first.author)
      : await profileAPI.resolveProfile(first.author);
    const reportedBy = author.pubKey;
    const reportedByProfile = {
      ethAddress: author.ethAddress, // Deprecated, to be removed
      pubKey: author.pubKey,
      name: author.name || '',
      userName: author.userName || '',
      avatar: author.avatar || '',
    };
    // count reports
    const reports = await reportingAPI.countReports(contentID);
    // add reasons
    const reasons = await reportingAPI.getReasons(contentID);
    Object.assign(finalDecision || {}, {
      reports,
      reportedBy,
      reportedDate,
      reportedByProfile,
      reasons,
    });
    await queryCache.set(decisionCache, finalDecision);
    return finalDecision;
  }

  /**
   * Compiles a special list of all moderated content to be used for the public transparency log.
   * @param profileAPI
   * @param reportingAPI
   * @param offset - Offset by number of records
   * @param limit - Limit number of records returned
   * @returns A list of objects with minimal info about the moderated content
   */
  async publicLog(
    profileAPI: ProfileAPI,
    reportingAPI: ModerationReportAPI,
    offset?: number,
    limit?: number,
  ) {
    let list: ModerationDecision[] = [];
    const db: Client = await getAppDB();
    const cachedList = this.getModeratedListCacheKey();
    if (await queryCache.has(cachedList)) {
      list = await queryCache.get<ModerationDecision[]>(cachedList);
    } else {
      const query = new Where('moderated').eq(true).orderByDesc('moderatedDate');
      list = await db.find<ModerationDecision>(this.dbID, this.collection, query);
      await queryCache.set(cachedList, list);
    }
    const offsetIndex = offset ? list.findIndex(item => item._id === offset.toString()) : 0;
    let endIndex = (limit || 10) + offsetIndex;
    if (list.length <= endIndex) {
      endIndex = undefined;
    }
    const results = list.slice(offsetIndex, endIndex);
    const nextIndex = endIndex ? list[endIndex]._id : '';
    const moderated = [];
    for (const result of results) {
      const decision = await this.getFinalDecision(result.contentID, profileAPI, reportingAPI);
      if (!decision?.moderator) {
        logger.warn(`${result.contentID} should not be in the moderated list!`);
        logger.warn(decision);
        continue;
      }
      // load moderator info
      const moderator = decision.moderator.startsWith('0x')
        ? await profileAPI.getProfile(decision.moderator)
        : await profileAPI.resolveProfile(decision.moderator);

      moderated.push({
        contentID: decision.contentID,
        contentType: decision.contentType,
        moderatedDate: decision.moderatedDate,
        moderator: {
          pubKey: moderator.pubKey,
          ethAddress: moderator.ethAddress, // Deprecated, to be removed
          name: moderator.name || '',
          userName: moderator.userName || '',
          avatar: moderator.avatar,
        },
        delisted: decision.delisted,
        reasons: decision.reasons,
        reports: decision.reports,
        explanation: decision.explanation,
      });
    }

    return { results: moderated, nextIndex: nextIndex, total: list.length };
  }

  /**
   * Moderate content by making a formal decision.
   * @param report - The object containing relevant data for the report
   * @param postsAPI - The posts data source API
   * @param commentsAPI
   * @returns The ModerationDecision object
   */
  async makeDecision(
    report: { contentId: string; data: ModerationDecision },
    postsAPI: PostsAPI,
    commentsAPI: CommentAPI,
  ) {
    const db: Client = await getAppDB();
    if (!report.data.moderator) {
      throw new Error('Not authorized');
    }

    // load existing (i.e. pending) decision data
    const decision = await this.getDecision(report.contentId);
    if (!decision) {
      const msg = `cannot moderate content that has not been reported -- contentID: ${report.contentId} `;
      logger.warn(msg);
      return Promise.reject(msg);
    }

    decision.moderator = report.data.moderator;
    decision.moderatedDate = new Date().getTime();
    decision.explanation = encodeString(report.data.explanation);
    decision.delisted = report.data.delisted;
    decision.moderated = true;
    if (!decision.actions) {
      decision.actions = [];
    }
    decision.actions.push({
      moderator: report.data.moderator,
      delisted: decision.delisted,
      moderatedDate: decision.moderatedDate,
      explanation: decision.explanation,
    });

    await db.save(this.dbID, this.collection, [decision]);
    // send notifications only when delisting
    if (decision.delisted) {
      let destUser = '';
      // get post author
      if (decision.contentType === 'post') {
        const post = await postsAPI.getPost(report.contentId);
        destUser = post.author;
      }
      if (decision.contentType === 'reply') {
        const comment = await commentsAPI.getComment(report.contentId);
        destUser = comment.author;
      }
      let notificationType = 'MODERATED_POST';
      if (decision.contentType === 'reply') {
        notificationType = 'MODERATED_REPLY';
      } else if (decision.contentType == 'account') {
        notificationType = 'MODERATED_ACCOUNT';
        destUser = report.contentId;
      }
      if (destUser) {
        await sendAuthorNotification(destUser, {
          property: notificationType,
          provider: 'awf.moderation.api',
          value: {
            author: report.data.moderator,
            moderatedID: report.contentId,
          },
        });
      }
    }
    // handle caching
    await queryCache.del(this.getDecisionCacheKey(report.contentId));
    await queryCache.del(this.getModeratedDecisionCacheKey(report.contentId));
    await queryCache.del(this.getCountersCacheKey());
    await queryCache.del(this.getModeratedListCacheKey());
    await queryCache.del(this.getPendingListCacheKey());

    return decision;
  }
}

export default ModerationDecisionAPI;
