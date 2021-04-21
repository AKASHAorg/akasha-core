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
    let results = await db.find<ModerationReport>(this.dbID, this.collection, query);
    const pending = results.length;
    // delisted
    query = new Where('moderated').eq(true).and('delisted').eq(true);
    results = await db.find<ModerationReport>(this.dbID, this.collection, query);
    const delisted = results.length;
    // kept
    query = new Where('moderated').eq(false).and('delisted').eq(false);
    results = await db.find<ModerationReport>(this.dbID, this.collection, query);
    const kept = results.length;

    return {
      pending,
      delisted,
      kept,
    };
  }

  async listDecisions(delisted: boolean, moderated: boolean, offset?: number, limit?: number) {
    limit = limit ? limit : 10;
    offset = offset ? offset : 0;
    const db: Client = await getAppDB();
    const query = new Where('delisted')
      .eq(delisted)
      .and('moderated')
      .eq(moderated)
      .skipNum(offset)
      .limitTo(limit);
    return await db.find<ModerationReport>(this.dbID, this.collection, query);
  }

  async getDecision(contentId: string) {
    const db: Client = await getAppDB();
    const query = new Where('contentId').eq(contentId);
    const decision = await db.find<ModerationDecision>(this.dbID, this.collection, query);
    if (decision.length) {
      return decision[0];
    }
    logger.warn(`moderation decision not found for contentId:${contentId}`);
    throw new Error('decision not found');
  }

  async makeDecision(contentId: string, moderator: string, explanation: string, delisted: boolean) {
    const db: Client = await getAppDB();
    if (!moderator) {
      throw new Error('Not authorized');
    }
    // load existing (i.e. pending) decision data
    let decision = await this.getDecision(contentId);

    decision.moderator = moderator;
    decision.moderatedDate = new Date().getTime();
    decision.explanation = explanation;
    decision.delisted = delisted;
    decision.moderated = true;

    return await db.create(this.dbID, this.collection, [decision]);
  }
}

export default ModerationDecisionAPI;
