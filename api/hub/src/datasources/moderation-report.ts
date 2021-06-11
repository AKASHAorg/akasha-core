import { DataSource } from 'apollo-datasource';
import { getAppDB, logger, decodeString, encodeString, sendEmailNotification } from '../helpers';
import { Client, ThreadID, Where } from '@textile/hub';
import { ModerationDecision, ModerationReport } from '../collections/interfaces';
import ModerationDecisionAPI from './moderation-decision';
import { queryCache } from '../storage/cache';

const moderationAppURL = process.env.MODERATION_APP_URL;

/**
 * The ModerationReportAPI class handles all the interactions between the reporting API
 * and the underlying storage layer.
 */
class ModerationReportAPI extends DataSource {
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
  * Get the name of the key for report cache.
  * @param contentID - The content identifier
  * @param author - The author of that report
  * @returns The key as a string
  */
  getReportCacheKey(contentID: string, author: string) {
    return `${this.collection}:contentID${contentID}:author${author}`;
  }

  /**
   * Count total number of reports.
   * @param contentID - The content identifier
   * @returns The number of reports as an integer
   */
  async countReports(contentID: string) {
    const db: Client = await getAppDB();
    const query = new Where('contentID').eq(contentID);
    const reports = await db.find<ModerationReport>(this.dbID, this.collection, query);
    return reports.length;
  }

  /**
   * Check if a user has reported this content.
   * @param contentID - The content identifier
   * @param author - The reporting user
   * @returns True/false to indicate if it exists or not
   */
  async exists(contentID: string, author: string) {
    const db: Client = await getAppDB();
    const query = new Where('contentID').eq(contentID).and('author').eq(author);
    const report = await db.find<ModerationReport>(this.dbID, this.collection, query);
    if (report.length) {
      return true;
    }
    return false;
  }

  /**
   * List reports for a given content identifier.
   * @param contentID - The content identifier
   * @param offset - The offset represented by number of records
   * @param limit - The limit of number records returned
   * @returns A list of ModerationReport objects
   */
  async listReports(contentID: string, offset?: number, limit?: number) {
    const db: Client = await getAppDB();
    const query = new Where('contentID')
      .eq(contentID)
      .skipNum(offset || 0)
      .limitTo(limit || 10)
      .orderByDesc('creationDate');
    const reports = await db.find<ModerationReport>(this.dbID, this.collection, query);
    const list = [];
    for (const report of reports) {
      report.explanation = decodeString(report.explanation);
      list.push(report);
    }
    return list;
  }

  /**
   * Get an individual report.
   * @param contentID - The content identifier
   * @param author - The author of this report
   * @returns A ModerationReport object
   */
  async getReport(contentID: string, author: string) {
    const reportCache = this.getReportCacheKey(contentID, author);
    if (await queryCache.has(reportCache)) {
      return queryCache.get(reportCache);
    }
    const db: Client = await getAppDB();
    const query = new Where('contentID').eq(contentID).and('author').eq(author);
    const reports = await db.find<ModerationReport>(this.dbID, this.collection, query);
    if (reports.length) {
      reports[0].explanation = decodeString(reports[0].explanation);
      return reports[0];
    }
    logger.warn(`report not found for contentID:${contentID} and author:${author}`);
    return undefined;
  }

  /**
   * Get the first report for a given content identifier. This is very useful
   * when trying to see who is the first person to report something.
   * @param contentID - The content identifier
   * @returns A ModerationReport object
   */
  async getFirstReport(contentID: string) {
    const db: Client = await getAppDB();
    // get the first report for this contentID
    const query = new Where('contentID').eq(contentID).orderBy('creationDate').limitTo(1);
    const reports = await db.find<ModerationReport>(this.dbID, this.collection, query);
    if (reports.length) {
      reports[0].explanation = decodeString(reports[0].explanation);
      return reports[0];
    }
    logger.warn(`no reports found for contentID:${contentID}`);
    throw new Error('report not found');
  }

  /**
   * Aggregate all reporting reasons for a given content identifier. This is useful to
   * moderators when they make their final decisions.
   * @param contentID - The content identifier
   * @returns A list of reasons as strings
   */
  async getReasons(contentID: string) {
    let reports: ModerationReport[];
    const db: Client = await getAppDB();
    const query = new Where('contentID').eq(contentID);
    reports = await db.find<ModerationReport>(this.dbID, this.collection, query);
    const reasons = [];
    if (reports.length) {
      for (const report of reports) {
        // add unique reasons to the list
        if (!reasons.includes(report.reason)) {
          reasons.push(report.reason);
        }
      }
    }
    return reasons;
  }

  /**
   * Adds a report to the data storage layer. It requires the decision collection
   * name in order to also register a pending decision for moderators (on first report).
   * @param decisionsCollection - The name of the collection that stores decisions
   * @param contentType - The type of content (i.e. post, comment, user, etc.)
   * @param contentID - The content identifier
   * @param author - The author of this report
   * @param reason - The reson for reporting this content
   * @param explanation - [optional] an explanation for reporting
   */
  async addReport(
    decisionsCollection: string,
    contentType: string,
    contentID: string,
    author: string,
    reason: string,
    explanation?: string,
  ) {
    const db: Client = await getAppDB();
    if (!author) {
      throw new Error('Not authorized');
    }

    const exists = await this.exists(contentID, author);
    if (exists) {
      return Promise.reject(`cannot report content ${contentID} twice as user ${author}`);
    }

    // we need to check if a pending decision was created for this post
    const query = new Where('contentID').eq(contentID);
    const results = await db.find<ModerationReport>(this.dbID, decisionsCollection, query);
    if (results.length < 1) {
      // need to create a pending decision to track moderation status
      // how to avoid race condition here?
      const decision: ModerationDecision = {
        _id: '',
        creationDate: new Date().getTime(),
        contentType: contentType,
        contentID: contentID,
        delisted: false,
        moderated: false,
      };
      const decisionID = await db.create(this.dbID, decisionsCollection, [decision]);
      if (!decisionID || !decisionID.length) {
        logger.warn(`pending decision could not be created for contentID ${contentID}`);
        // throw new Error('pending decision could not be created');
      }
      // send email notification to moderators
      const text = `There is a new pending request for moderation.
      Please visit the moderation app (${moderationAppURL})
      to moderate this content.
      \nThank you!`;
      const html = `<p>There is a new pending request for moderation.
      Please visit the <a href="${moderationAppURL}">moderation app</a>
      to moderate this content.</p>
      <br>
      <p>Thank you!</p>`;
      const msg = {
        to: process.env.MODERATION_EMAIL,
        from: process.env.MODERATION_EMAIL,
        subject: "New moderation request on Ethereum World",
        text,
        html
      };
      sendEmailNotification(msg).catch(e => {
        logger.warn(`Cound not send email notification to moderator list ${process.env.MODERATION_EMAIL}`);
      });
    }

    const report: ModerationReport = {
      _id: '',
      creationDate: new Date().getTime(),
      author,
      contentType,
      contentID,
      reason: reason,
      explanation: encodeString(explanation),
    };
    const reportID = await db.create(this.dbID, this.collection, [report]);
    if (!reportID || !reportID.length) {
      logger.warn(`report by ${author} for contentID ${contentID} could not be created`);
      throw new Error('report could not be created');
    }
    // cache the report
    const reportCache = this.getReportCacheKey(contentID, author);
    await queryCache.set(reportCache, report);

    // invalidate counters cache
    const decisionsAPI = new ModerationDecisionAPI({
      dbID: this.dbID,
      collection: 'ModerationDecisions',
    });
    // clear cache
    await queryCache.del(decisionsAPI.getCountersCacheKey());
    await queryCache.del(decisionsAPI.getPendingListCacheKey());
  }
}

export default ModerationReportAPI;
