import { DataSource } from 'apollo-datasource';
import { getAppDB, logger, encodeString, decodeString } from '../helpers';
import { Client, ThreadID, Where } from '@textile/hub';
import { ModerationAction } from '../collections/interfaces';
import { queryCache } from '../storage/cache';

/**
 * The ModerationActionAPI class handles all the interactions between the
 * moderation actions API and the underlying storage layer.
 */
class ModerationActionAPI extends DataSource {
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
   * Get the name of the key for list of pending items cache
   * @returns The key as a string
  */
  getListCacheKey() {
    return `${this.collection}:list`;
  }

  async listActions(contentID: string, offset?: string, limit?: number) {
    const db: Client = await getAppDB();
    let list: ModerationAction[];
    const cachedList = this.getListCacheKey();
    if (await queryCache.has(cachedList)) {
      list = await queryCache.get(cachedList);
    } else {
      const query = new Where('contentID').eq(contentID).orderByDesc('moderatedDate');
      list = await db.find<ModerationAction>(this.dbID, this.collection, query);
      await queryCache.set(cachedList, list);
    }
    const offsetIndex = offset ? list.findIndex(item => item._id === offset) : 0;
    let endIndex = (limit || 10) + offsetIndex;
    if (list.length <= endIndex) {
      endIndex = undefined;
    }
    const results = list.slice(offsetIndex, endIndex);
    const nextIndex = endIndex ? list[endIndex]._id : null;
    return { results: results, nextIndex: nextIndex, total: list.length };
  }

  async addAction(action: ModerationAction) {
    const db: Client = await getAppDB();
    const id = await db.create(this.dbID, this.collection, [action]);
    if (!id) {
      logger.warn(`moderation action by ${action.moderator} for contentID ${action.contentID} could not be created`);
      throw new Error('moderation action could not be created');
    }
    // clear cache
    await queryCache.del(this.getListCacheKey());
    return id;
  }
}

export default ModerationActionAPI;
