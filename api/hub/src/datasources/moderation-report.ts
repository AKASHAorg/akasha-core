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

  async countReports(contentId: string) {
    const db: Client = await getAppDB();
    const query = new Where('contentId').eq(contentId);
    const reports = await db.find<ModerationReport>(this.dbID, this.collection, query);
    return reports.length;
  }

  async getReport(contentId: string, author: string) {
    const db: Client = await getAppDB();
    const query = new Where('contentId').eq(contentId).and('author').eq(author);
    const report = await db.find<ModerationReport>(this.dbID, this.collection, query);
    if (report.length) {
      return report[0];
    }
    logger.warn(`report not found for contentId:${contentId} and author:${author}`);
    throw new Error('report not found');
  }

  async getReports(contentId: string, limit?: number, offset?: number) {
    limit = limit ? limit : 10;
    offset = offset ? offset : 0;
    const db: Client = await getAppDB();
    const query = new Where('contentId').eq(contentId).skipNum(offset).limitTo(limit);
    return await db.find<ModerationReport>(this.dbID, this.collection, query);
  }

  async getFirstReport(contentId: string) {
    const db: Client = await getAppDB();
    // get the first report for this contentID
    const query = new Where('contentId').eq(contentId).orderBy('creationDate').limitTo(1);
    const report = await db.find<ModerationReport>(this.dbID, this.collection, query);
    if (report.length) {
      return report[0];
    }
    logger.warn(`no reports found for contentId:${contentId}`);
    throw new Error('report not found');
  }

  async getReasons(contentId: string) {
    let reports: ModerationReport[];
    const db: Client = await getAppDB();
    const query = new Where('contentId').eq(contentId);
    reports = await db.find<ModerationReport>(this.dbID, this.collection, query);
    let reasons: string[];
    if (reports.length) {
      for (const report of reports) {
        // add unique reasons to the list
        if (reasons.includes(report.reason) === false) {
          reasons.push(report.reason);
        }
      }
    }
    return reasons;
  }

  async addReport(
    decisionsCollection: string,
    contentType: string,
    contentId: string,
    author: string,
    reason: string,
    explanation?: string,
  ) {
    const db: Client = await getAppDB();
    if (!author) {
      throw new Error('Not authorized');
    }

    let exists = await this.getReport(contentId, author);
    if (exists) {
      return Promise.reject(`cannot report content ${contentId} twice as user ${author}`);
    }

    // Do we need to check if a pending decision was created for this post?
    const query = new Where('contentId').eq(contentId);
    const results = await db.find<ModerationReport>(this.dbID, decisionsCollection, query);
    if (results.length < 1) {
      // need to create it (how to avoid race condition here?)
      const decision: ModerationDecision = {
        _id: '',
        creationDate: new Date().getTime(),
        contentType: contentType,
        contentId: contentId,
        delisted: false,
        moderated: false,
      };
      const decisionID = await db.create(this.dbID, decisionsCollection, [decision]);
      if (!decisionID || !decisionID.length) {
        logger.warn(`pending decision could not be created for contentId ${contentId}`);
        throw new Error('pending decision could not be created');
      }
    }

    const report: ModerationReport = {
      _id: '',
      creationDate: new Date().getTime(),
      author: author,
      contentType: contentType,
      contentId: contentId,
      reason: reason,
      explanation: explanation ? explanation : '',
    };
    const reportID = await db.create(this.dbID, this.collection, [report]);
    if (!reportID || !reportID.length) {
      logger.warn(`report by ${author} for contentId ${contentId} could not be created`);
      throw new Error('report could not be created');
    }
    return reportID[0];
  }
}

export default ModerationReportAPI;
