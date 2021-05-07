import { DataSource } from 'apollo-datasource';
import { getAppDB, logger, encodeString, decodeString } from '../helpers';
import { Client, ThreadID, Where } from '@textile/hub';
import { ModerationDecision } from '../collections/interfaces';
import ProfileAPI from './profile';
import ModerationReportAPI from './moderation-report';
import { queryCache } from '../storage/cache';

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

  getDecisionCacheKey(contentID: string) {
    return `${this.collection}:contentID${contentID}`;
  }

  getCountersCacheKey() {
    return `${this.collection}:counters`;
  }

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

  async listDecisions(delisted: boolean, moderated: boolean, offset?: number, limit?: number) {
    const db: Client = await getAppDB();
    const query = new Where('delisted')
      .eq(delisted)
      .and('moderated')
      .eq(moderated)
      .skipNum(offset || 0)
      .limitTo(limit || 10)
      .orderByDesc(moderated ? 'moderatedDate' : 'creationDate');
    const list = await db.find<ModerationDecision>(this.dbID, this.collection, query);
    return list;
  }

  async getDecision(contentID: string) {
    const db: Client = await getAppDB();
    const query = new Where('contentID').eq(contentID);
    const decisions = await db.find<ModerationDecision>(this.dbID, this.collection, query);
    if (decisions.length) {
      decisions[0].explanation = decodeString(decisions[0].explanation);
      return decisions[0];
    }
    logger.warn(`moderation decision not found for contentID: ${contentID} `);
    return undefined;
  }

  async getFinalDecision(contentID: string) {
    const decisionCache = this.getDecisionCacheKey(contentID);
    if (await queryCache.has(decisionCache)) {
      return queryCache.get(decisionCache);
    }
    const profileAPI = new ProfileAPI({ dbID: this.dbID, collection: 'Profiles' });
    const reportingAPI = new ModerationReportAPI({
      dbID: this.dbID,
      collection: 'ModerationReports',
    });
    let decision = await this.getDecision(contentID);
    if (decision.moderator) {
      const moderator = await profileAPI.getProfile(decision.moderator);
      decision = Object.assign({}, decision, moderator);
    }
    const first = await reportingAPI.getFirstReport(contentID);
    const reportedBy = first.author;
    const reportedDate = first.creationDate;
    const reports = await reportingAPI.countReports(contentID);
    const reasons = await reportingAPI.getReasons(contentID);
    decision = Object.assign({}, decision, { reports, reportedBy, reportedDate, reasons });
    await queryCache.set(decisionCache, decision);
    return decision;
  }

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

    await db.save(this.dbID, this.collection, [decision]);
    await queryCache.del(this.getDecisionCacheKey(contentID));
    await queryCache.del(this.getCountersCacheKey());
    return true;
  }
}

export default ModerationDecisionAPI;
