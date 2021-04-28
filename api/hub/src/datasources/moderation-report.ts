import { DataSource } from 'apollo-datasource';
import { getAppDB, logger } from '../helpers';
import { Client, ThreadID, Where } from '@textile/hub';
import { ModerationDecision, ModerationReport } from '../collections/interfaces';

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

  async countReports(contentID: string) {
    const db: Client = await getAppDB();
    const query = new Where('contentID').eq(contentID);
    const reports = await db.find<ModerationReport>(this.dbID, this.collection, query);
    return reports.length;
  }

  async exists(contentID: string, author: string) {
    const db: Client = await getAppDB();
    const query = new Where('contentID').eq(contentID).and('author').eq(author);
    const report = await db.find<ModerationReport>(this.dbID, this.collection, query);
    if (report.length) {
      return true;
    }
    return false;
  }

  async listReports(contentID: string, offset?: number, limit?: number) {
    const db: Client = await getAppDB();
    const query = new Where('contentID')
      .eq(contentID)
      .skipNum(offset || 0)
      .limitTo(limit || 10);
    return db.find<ModerationReport>(this.dbID, this.collection, query);
  }

  async getReport(contentID: string, author: string) {
    const db: Client = await getAppDB();
    const query = new Where('contentID').eq(contentID).and('author').eq(author);
    const report = await db.find<ModerationReport>(this.dbID, this.collection, query);
    if (report.length) {
      return report[0];
    }
    logger.warn(`report not found for contentID:${contentID} and author:${author}`);
    return undefined;
  }

  async getFirstReport(contentID: string) {
    const db: Client = await getAppDB();
    // get the first report for this contentID
    const query = new Where('contentID').eq(contentID).orderBy('creationDate').limitTo(1);
    const report = await db.find<ModerationReport>(this.dbID, this.collection, query);
    if (report.length) {
      return report[0];
    }
    logger.warn(`no reports found for contentID:${contentID}`);
    throw new Error('report not found');
  }

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

    // Do we need to check if a pending decision was created for this post?
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
        throw new Error('pending decision could not be created');
      }
    }

    const report: ModerationReport = {
      _id: '',
      creationDate: new Date().getTime(),
      author: author,
      contentType: contentType,
      contentID: contentID,
      reason: reason,
      explanation: explanation ? explanation : '',
    };
    const reportID = await db.create(this.dbID, this.collection, [report]);
    if (!reportID || !reportID.length) {
      logger.warn(`report by ${author} for contentID ${contentID} could not be created`);
      throw new Error('report could not be created');
    }
    return reportID[0];
  }
}

export default ModerationReportAPI;
