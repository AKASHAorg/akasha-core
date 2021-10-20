import { DataSource } from 'apollo-datasource';
import { encodeString, decodeString, getAppDB } from '../helpers';
import { Client, ThreadID, Where } from '@textile/hub';
import { ModerationReason } from '../collections/interfaces';
import { queryCache } from '../storage/cache';

/**
 * The ModerationReasonAPI class handles all the interactions between the
 * reasons API and the underlying storage layer.
 */
class ModerationReasonAPI extends DataSource {
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
   * Get the name of the key for a moderation reason cache.
   * @param label - The reason's label (name)
   * @returns The key as a string
   */
  getReasonCacheKey(label: string) {
    return `${this.collection}:reason:${label}`;
  }

  /**
   * Get the name of the key for a reasons list cache.
   * @returns The key as a string
   */
  getReasonListCacheKey(active: boolean) {
    return `${this.collection}:ModerationReasons:${active.toString()}`;
  }

  /**
   * Update moderation reason data.
   * @param label - The label for this reason
   * @param description - A longer description of the reason
   * @param active - A boolean flag for the active status
   */
  async updateReason(label: string, description: string, active: boolean) {
    const reasonCache = this.getReasonCacheKey(label);
    const db: Client = await getAppDB();

    // check if reason already exists
    let reason: ModerationReason;
    const query = new Where('label').eq(label);
    const results = await db.find<ModerationReason>(this.dbID, this.collection, query);
    if (results.length) {
      reason = results[0];
      reason.label = encodeString(label);
      reason.description = encodeString(description);
      reason.active = active;
      await db.save(this.dbID, this.collection, [reason]);
    } else {
      reason = {
        label: encodeString(label),
        description: encodeString(description),
        active,
        _id: '',
        creationDate: new Date().getTime(),
      };
      const id = await db.create(this.dbID, this.collection, [reason]);
      reason._id = id[0];
    }
    await queryCache.set(reasonCache, reason);
    // clear cache for list of reasons
    await queryCache.del(this.getReasonListCacheKey(active));
  }

  /**
   * List of reasons for reporting/moderating content.
   * @param active - The status of the reason, to use as a filter
   * @returns A list of ModerationReason objects
   */
  async listReasons(active: boolean) {
    const reasonsCache = this.getReasonListCacheKey(active);
    if (await queryCache.has(reasonsCache)) {
      return await queryCache.get(reasonsCache);
    }
    const db: Client = await getAppDB();
    const query = new Where('active').eq(active).orderByDesc('creationDate');
    const reasons = await db.find<ModerationReason>(this.dbID, this.collection, query);
    const list = [];
    for (const reason of reasons) {
      reason.label = decodeString(reason.label);
      reason.description = decodeString(reason.description);
      list.push(reason);
    }
    if (list.length) {
      await queryCache.set(reasonsCache, list);
    }
    return list;
  }

  /**
   * Delete a reason.
   * @param id - The Textile identifier of the reason
   * @returns True if the reason was deleted, or false if the reason ID was not found
   */
  async deleteReason(id: string) {
    const db: Client = await getAppDB();
    const reason = await db.findByID<ModerationReason>(this.dbID, this.collection, id);
    if (reason) {
      await db.delete(this.dbID, this.collection, [id]);
      await queryCache.del(this.getReasonCacheKey(reason.label));
      await queryCache.del(this.getReasonListCacheKey(reason.active));
      return true;
    }
    return false;
  }
}

export default ModerationReasonAPI;
