import { DataSource } from 'apollo-datasource';
import { getAppDB, logger } from '../helpers';
import { Client, ThreadID, Where } from '@textile/hub';
import { Moderator } from '../collections/interfaces';

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
   * Get data for a moderator.
   * @param address the ETH address of the moderator
   * @returns Moderator
   */
  async getModerator(ethAddress: string) {
    const db: Client = await getAppDB();
    const query = new Where('ethAddress').eq(ethAddress);
    const results = await db.find<Moderator>(this.dbID, this.collection, query);
    if (results.length) {
      return results[0];
    }
    logger.warn(`could not find moderator with address ${ethAddress}`);
    return undefined;
  }

  /**
   * Check if the given user is a moderator.
   * @param ethAddress the ETH address of the moderator
   * @returns boolean
   */
  async isModerator(ethAddress: string) {
    const db: Client = await getAppDB();
    const query = new Where('ethAddress').eq(ethAddress).and('active').eq(true);
    const results = await db.find<Moderator>(this.dbID, this.collection, query);
    return results.length > 0 ? true : false;
  }

  /**
   * Check if the given user is an admin.
   * @param ethAddress the ETH address of the moderator
   * @returns boolean
   */
  async isAdmin(ethAddress: string) {
    const db: Client = await getAppDB();
    const query = new Where('ethAddress').eq(ethAddress).and('active').eq(true).and('admin').eq(true);
    const results = await db.find<Moderator>(this.dbID, this.collection, query);
    return results.length > 0 ? true : false;
  }

  /**
   * Update moderator data (admin/active).
   * @param ethAddress the ETH address of the moderator
   * @param admin boolean for the admin status
   * @param active boolean for the active status
   */
  async updateModerator(ethAddress: string, admin: boolean, active: boolean) {
    const db: Client = await getAppDB();
    // check if moderator already exists
    const exists = await this.isModerator(ethAddress);
    let moderator: Moderator;
    if (exists) {
      moderator = await this.getModerator(ethAddress);
      moderator.admin = admin;
      moderator.active = active;
      return db.save(this.dbID, this.collection, [moderator]);
    }
    moderator = {
      ethAddress,
      admin,
      active,
      _id: '',
      creationDate: new Date().getTime(),
    };
    await db.create(this.dbID, this.collection, [moderator]);
  }
}

export default ModerationAdminAPI;
