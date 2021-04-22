import { DataSource } from 'apollo-datasource';
import { getAppDB, logger } from '../helpers';
import { Client, ThreadID, Where } from '@textile/hub';
import { Moderator } from '../collections/interfaces';

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

  async getModerator(address: string) {
    const db: Client = await getAppDB();
    const query = new Where('address').eq(address);
    const results = await db.find<Moderator>(this.dbID, this.collection, query);
    if (results.length) {
      return results[0];
    }
    logger.warn(`could not find moderator with address ${address}`);
    throw new Error('moderator not found');
  }

  async isModerator(address: string) {
    const db: Client = await getAppDB();
    const query = new Where('address').eq(address).and('active').eq(true);
    const results = await db.find<Moderator>(this.dbID, this.collection, query);
    return results.length ? true : false;
  }

  async isAdmin(address: string) {
    const db: Client = await getAppDB();
    const query = new Where('address').eq(address).and('active').eq(true).and('admin').eq(true);
    const results = await db.find<Moderator>(this.dbID, this.collection, query);
    return results.length ? true : false;
  }

  async updateModerator(ethAddress: string, admin: boolean, active: boolean) {
    let moderator: Moderator;
    moderator._id = '';
    moderator.ethAddress = ethAddress;
    moderator.creationDate = new Date().getTime();
    // check if moderator already exists
    const exists = this.isModerator(ethAddress);
    if (exists) {
      moderator = await this.getModerator(ethAddress);
    }
    moderator.admin = admin;
    moderator.active = active;
    const db: Client = await getAppDB();
    if (exists) {
      await db.save(this.dbID, this.collection, [moderator]);
      return true;
    }
    await db.create(this.dbID, this.collection, [moderator]);
    return true;
  }
}

export default ModerationAdminAPI;
