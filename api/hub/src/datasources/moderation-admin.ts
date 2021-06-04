import { DataSource } from 'apollo-datasource';
import { getAppDB, logger } from '../helpers';
import { Client, ThreadID, Where } from '@textile/hub';
import { Moderator } from '../collections/interfaces';
import { queryCache } from '../storage/cache';

/**
 * The ModerationAdminAPI class handles all the interactions between the admin
 * API and the underlying storage layer.
 */
class ModerationAdminAPI extends DataSource {
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
   * Get the name of the key for moderators cache.
   * @param ethAddress - The moderator's ETH address
   * @returns The key as a string
   */
   getModeratorCacheKey(ethAddress: string) {
    return `${this.collection}:ethAddress${ethAddress}`;
  }

  /**
   * Get data for a moderator.
   * @param address - The ETH address of the moderator
   * @returns A Moderator object
   */
  async getModerator(ethAddress: string) {
    const moderatorCache = this.getModeratorCacheKey(ethAddress);
    if (await queryCache.has(moderatorCache)) {
      return await queryCache.get(moderatorCache);
    }
    const db: Client = await getAppDB();
    const query = new Where('ethAddress').eq(ethAddress);
    const results = await db.find<Moderator>(this.dbID, this.collection, query);
    if (results.length) {
      await queryCache.set(moderatorCache, results[0]);
      return results[0];
    }
    logger.warn(`could not find moderator with address ${ethAddress}`);
    return undefined;
  }

  /**
   * Check if the given user is a moderator.
   * @param ethAddress - The ETH address of the moderator
   * @returns True/false whether the user is a moderator
   */
  async isModerator(ethAddress: string) {
    const moderator = await this.getModerator(ethAddress);
    return moderator.active ? true : false;
  }

  /**
   * Check if the given user is an admin.
   * @param ethAddress - The ETH address of the moderator
   * @returns True/false whether the user is an admin
   */
  async isAdmin(ethAddress: string) {
    const moderator = await this.getModerator(ethAddress);
    return moderator.active && moderator.admin ? true : false;
  }

  /**
   * Update moderator data (admin/active).
   * @param ethAddress - The ETH address of the moderator
   * @param admin - A boolean flag for the admin status
   * @param active - A boolean flag for the active status
   */
  async updateModerator(ethAddress: string, admin: boolean, active: boolean) {
    const moderatorCache = this.getModeratorCacheKey(ethAddress);
    const db: Client = await getAppDB();
    // check if moderator already exists
    const exists = await this.isModerator(ethAddress);
    let moderator: Moderator;
    if (exists) {
      moderator = await this.getModerator(ethAddress);
      moderator.admin = admin;
      moderator.active = active;
      await db.save(this.dbID, this.collection, [moderator]);
      await queryCache.set(moderatorCache, moderator);
      return;
    }
    moderator = {
      ethAddress,
      admin,
      active,
      _id: '',
      creationDate: new Date().getTime(),
    };
    await db.create(this.dbID, this.collection, [moderator]);
    await queryCache.set(moderatorCache, moderator);
  }
}

export default ModerationAdminAPI;
