import { DataSource } from 'apollo-datasource';
import { getAppDB, logger, encodeString, decodeString, sendAuthorNotification } from '../helpers';
import { Client, ThreadID, Where } from '@textile/hub';
import { ModerationDecision, ModerationAction } from '../collections/interfaces';
import ProfileAPI from './profile';
import ModerationReportAPI from './moderation-report';
import { queryCache } from '../storage/cache';
import { parse, stringify } from 'flatted';

/**
 * The ModerationDecisionAPI class handles all the interactions between the
 * moderation decisions API and the underlying storage layer.
 */
class ModerationDecisionAPI extends DataSource {
  private readonly collection: string;
  private context: any;
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
   async getDecision(contentID: string) {
    const decisionCache = this.getDecisionCacheKey(contentID);
    if (await queryCache.has(decisionCache)) {
      return queryCache.get(decisionCache);
    }
    const db: Client = await getAppDB();
    const query = new Where('contentID').eq(contentID);
    const decisions = await db.find<ModerationDecision>(this.dbID, this.collection, query);
    if (decisions.length) {
      decisions[0].explanation = decodeString(decisions[0].explanation);
      await queryCache.set(decisionCache, decisions[0]);
      return decisions[0];
    }
    return undefined;
  }

  /**
   * List the moderation actions log for each content identifier.
   * @param contentID - The content identifier
   * @returns A list of ModerationDecision objects
   */
  async listActions(contentID: string) {
    let decision = parse(stringify(await this.getDecision(contentID)));
    if (decision.actions && decision.actions.length) {
      decision.actions.forEach((element, index) => {
        element.explanation = decodeString(element.explanation);
        decision.actions[index] = element;
      });
    }
    return decision;
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
      list = await queryCache.get(listType);
    } else {
      const query = moderated ? new Where('moderated').eq(true).orderByDesc('moderatedDate') :
      {
        sort: { desc: true, fieldPath: 'creationDate' },
      }
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
    const nextIndex = endIndex ? list[endIndex]._id : null;
    return { results: results, nextIndex: nextIndex, total: list.length };
  }

  /**
   * Compiles a special list of all moderated content to be used for the public transparency log.
   * @param offset - Offset by number of records
   * @param limit - Limit number of records returned
   * @returns A list of objects with minimal info about the moderated content
   */
  async publicLog(offset?: number, limit?: number) {
    let list = [];
    const db: Client = await getAppDB();
    const cachedList = this.getModeratedListCacheKey();
    if (await queryCache.has(cachedList)) {
      list = await queryCache.get(cachedList);
    } else {
      const query = new Where('moderated').eq(true).orderByDesc('moderatedDate');
      list = await db.find<ModerationDecision>(this.dbID, this.collection, query);
      await queryCache.set(cachedList, list);
    }
    const offsetIndex = offset ? list.findIndex(item => item._id === offset) : 0;
    let endIndex = (limit || 10) + offsetIndex;
    if (list.length <= endIndex) {
      endIndex = undefined;
    }
    const results = list.slice(offsetIndex, endIndex);
    const nextIndex = endIndex ? list[endIndex]._id : null;
    const moderated = [];
    for (const result of results) {
      const decision = await this.getFinalDecision(result.contentID);
      // load moderator info
      const profileAPI = new ProfileAPI({ dbID: this.dbID, collection: 'Profiles' });
      const moderator = await profileAPI.getProfile(decision.moderator);

      moderated.push({
        contentID: decision.contentID,
        contentType: decision.contentType,
        moderatedDate: decision.moderatedDate,
        moderator: {
          ethAddress: moderator.ethAddress,
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
   * Aggregates data for a final decision. It contains profile data for moderator,
   * first report, number of total reports, and full list of reasons it was reported for.
   * @param contentID The content identifier
   * @returns An object with all the relevant data
   */
  async getFinalDecision(contentID: string) {
    const decisionCache = this.getModeratedDecisionCacheKey(contentID);
    if (await queryCache.has(decisionCache)) {
      return queryCache.get(decisionCache);
    }
    let decision = await this.getDecision(contentID);
    // remove action log as it is not needed here
    let { actions, ...finalDecision } = decision;
    // add moderator data
    if (finalDecision.moderator) {
      const profileAPI = new ProfileAPI({ dbID: this.dbID, collection: 'Profiles' });
      const moderator = await profileAPI.getProfile(finalDecision.moderator);
      finalDecision = Object.assign({}, finalDecision, { 
        moderatorProfile: {
          ethAddress: moderator.ethAddress,
          name: moderator.name || "",
          userName: moderator.userName || "",
          avatar: moderator.avatar,
        }
      });
    }
    // add first report data
    const reportingAPI = new ModerationReportAPI({
      dbID: this.dbID,
      collection: 'ModerationReports',
    });
    const first = await reportingAPI.getFirstReport(contentID);
    const reportedBy = first.author;
    const reportedDate = first.creationDate;
    // count reports
    const reports = await reportingAPI.countReports(contentID);
    // add reasons
    const reasons = await reportingAPI.getReasons(contentID);
    finalDecision = Object.assign({}, finalDecision, { reports, reportedBy, reportedDate, reasons });
    await queryCache.set(decisionCache, finalDecision);
    return finalDecision;
  }

  /**
   * Moderate content by making a formal decision.
   * @param contentID - The content identifier
   * @param moderator - The moderator user who made the final decision
   * @param explanation - Personal conclusion of the moderator
   * @param delisted - Outcome of the moderation action (delisted or kept)
   * @reurns The ModerationDecision object
   */
  async makeDecision(contentID: string, moderator: string, explanation: string, delisted: boolean) {
    const db: Client = await getAppDB();
    if (!moderator) {
      throw new Error('Not authorized');
    }
    // load existing (i.e. pending) decision data
    const decision = await this.getDecision(contentID);
    if (!decision) {
      const msg = `cannot moderate content that has not been reported -- contentID: ${contentID} `;
      logger.warn(msg);
      return Promise.reject(msg);
    }

    decision.moderator = moderator;
    decision.moderatedDate = new Date().getTime();
    decision.explanation = encodeString(explanation);
    decision.delisted = delisted;
    decision.moderated = true;
    if (!decision.actions) {
      decision.actions = [];
    }
    decision.actions.push({
      moderator,
      delisted,
      moderatedDate: decision.moderatedDate,
      explanation: decision.explanation,
    });

    await db.save(this.dbID, this.collection, [decision]);
    // send notifications only when delisting
    if (delisted) {
      const profileAPI = new ProfileAPI({ dbID: this.dbID, collection: 'Profiles' });
      const moderatorProfile = await profileAPI.getProfile(moderator);
      let notificationType = 'MODERATED_POST';
      if (decision.contentType === 'reply') {
        notificationType = 'MODERATED_REPLY';
      } else if (decision.contentType == 'account') {
        notificationType = 'MODEREATED_ACCOUNT';
        const account = await profileAPI.getProfile(contentID);
        contentID = account.pubKey;
      }
      await sendAuthorNotification(moderatorProfile.pubKey, {
        property: notificationType,
        provider: 'awf.moderation.api',
        value: {
          author: moderatorProfile.pubKey,
          moderatedID: contentID,
        },
      });
    }
    // handle caching
    await queryCache.del(this.getDecisionCacheKey(contentID));
    await queryCache.del(this.getModeratedDecisionCacheKey(contentID));
    await queryCache.del(this.getCountersCacheKey());
    await queryCache.del(this.getModeratedListCacheKey());
    await queryCache.del(this.getPendingListCacheKey());

    return decision;
  }
}

export default ModerationDecisionAPI;
