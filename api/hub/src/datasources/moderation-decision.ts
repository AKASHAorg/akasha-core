import { DataSource } from 'apollo-datasource';
import { getAppDB, logger } from '../helpers';
import { Client, ThreadID, Where } from '@textile/hub';
import { ModerationDecision, ModerationReport } from '../collections/interfaces';

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

  async countDecisions() {
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

    return {
      pending,
      delisted,
      kept,
    };
  }

  async listDecisions(delisted: boolean, moderated: boolean, offset?: number, limit?: number) {
    const db: Client = await getAppDB();
    const query = new Where('delisted')
      .eq(delisted)
      .and('moderated')
      .eq(moderated)
      .skipNum(offset || 0)
      .limitTo(limit || 10);
    return db.find<ModerationDecision>(this.dbID, this.collection, query);
  }

  async getDecision(contentId: string) {
    const db: Client = await getAppDB();
    const query = new Where('contentID').eq(contentId);
    const decision = await db.find<ModerationDecision>(this.dbID, this.collection, query);
    if (decision.length) {
      return decision[0];
    }
    logger.warn(`moderation decision not found for contentId:${contentId}`);
    return undefined;
  }

  async makeDecision(contentId: string, moderator: string, explanation: string, delisted: boolean) {
    const db: Client = await getAppDB();
    if (!moderator) {
      throw new Error('Not authorized');
    }
    // load existing (i.e. pending) decision data
    const decision = await this.getDecision(contentId);
    if (!decision) {
      const msg = `cannot moderate content that is not pending -- contentId:${contentId}`;
      logger.warn(msg);
      return Promise.reject(msg);
    }

    decision.moderator = moderator;
    decision.moderatedDate = new Date().getTime();
    decision.explanation = explanation;
    decision.delisted = delisted;
    decision.moderated = true;

    await db.save(this.dbID, this.collection, [decision]);
    return true;
  }
}

export default ModerationDecisionAPI;
