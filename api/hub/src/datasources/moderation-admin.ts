import { DataSource } from 'apollo-datasource';
import { getAppDB } from '../helpers';
import { Client, ThreadID } from '@textile/hub';
import type { ModeratorSocialLink } from '../collections/interfaces';
import { Moderator, ModeratorDisableReason, ModeratorStatus } from '../collections/interfaces';
import { queryCache } from '../storage/cache';
import { ethers } from 'ethers';
import ProfileAPI from './profile';

/**
 * The ModerationAdminAPI class handles all the interactions between the admin
 * API and the underlying storage layer.
 */
class ModerationAdminAPI extends DataSource {
  private readonly collection: string;
  private context;
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
   * @param user - The moderator user
   * @returns The key as a string
   */
  getModeratorCacheKey(user: string) {
    return `${this.collection}:${user}`;
  }

  /**
   * Get data for a moderator.
   * @param user - The moderator user for which we're getting data
   * @returns A Moderator object
   */
  async getModerator(user: string): Promise<Moderator | undefined> {
    const moderatorCacheKey = this.getModeratorCacheKey(user);
    if (await queryCache.has(moderatorCacheKey)) {
      return queryCache.get<Moderator>(moderatorCacheKey);
    }
    const db: Client = await getAppDB();
    try {
      const moderator = await db.findByID<Moderator>(this.dbID, this.collection, user);
      await queryCache.set(moderatorCacheKey, moderator);
      return moderator;
    } catch (err) {
      return undefined;
    }
  }

  /**
   * Check if the given user is a moderator.
   * @param user - The user to check if is moderator
   * @returns True/false whether the user is a moderator
   */
  async isModerator(user: string) {
    const moderator = await this.getModerator(user);
    return moderator && moderator.active;
  }

  /**
   * Check if the given user is an admin.
   * @param user - The user to check if is admin
   * @returns True/false whether the user is an admin
   */
  async isAdmin(user: string) {
    const moderator = await this.getModerator(user);
    return moderator && moderator.active && moderator.admin;
  }

  async disableModerator(pubKey: string, reason: ModeratorDisableReason) {
    const moderator = await this.getModerator(pubKey);
    if (!moderator) {
      throw new Error(`${pubKey} not a moderator!`);
    }
    let log: ModeratorStatus[] = [];
    if (moderator.activityLog && Array.isArray(moderator.activityLog)) {
      log = moderator.activityLog;
    }
    log.push({
      timestamp: new Date().getTime(),
      reason,
    });
    moderator.activityLog = log;
    moderator.active = false;
    moderator.updatedAt = new Date().getTime();
    const moderatorCacheKey = this.getModeratorCacheKey(pubKey);
    const db: Client = await getAppDB();
    await db.save(this.dbID, this.collection, [moderator]);
    await queryCache.del(moderatorCacheKey);
    return;
  }

  async listModerators() {
    const db: Client = await getAppDB();
    try {
      return db.find<Moderator>(this.dbID, this.collection, {
        sort: { desc: true, fieldPath: 'creationDate' },
      });
    } catch (err) {
      return undefined;
    }
  }
  /**
   * Update moderator data (admin/active).
   * @param user - The moderator user
   * @param admin - A boolean flag for the admin status
   * @param active - A boolean flag for the active status
   * @param profileAPI
   * @param links
   */
  async updateModerator(
    user: string,
    admin: boolean,
    active: boolean,
    profileAPI: ProfileAPI,
    links?: ModeratorSocialLink[],
  ) {
    // resolve ETH address to pubKey if needed
    if (ethers.utils.isAddress(user)) {
      const moderator = await profileAPI.getProfile(user);
      if (moderator) {
        user = moderator.pubKey;
      }
    }
    const moderatorCacheKey = this.getModeratorCacheKey(user);
    const db: Client = await getAppDB();
    // check if moderator already exists
    let moderator = await this.getModerator(user);
    if (moderator) {
      moderator.admin = admin;
      moderator.active = active;
      if (Array.isArray(links)) {
        moderator.links = links;
      }
      moderator.updatedAt = new Date().getTime();
      await db.save(this.dbID, this.collection, [moderator]);
      await queryCache.del(moderatorCacheKey);
      return;
    }
    moderator = {
      _id: user,
      admin,
      active,
      links,
      creationDate: new Date().getTime(),
    };
    await db.create(this.dbID, this.collection, [moderator]);
    await queryCache.set(moderatorCacheKey, moderator);
  }
}

export default ModerationAdminAPI;
