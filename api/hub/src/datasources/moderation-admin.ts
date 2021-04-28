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
    const query = new Where('ethAddress').eq(address);
    const results = await db.find<Moderator>(this.dbID, this.collection, query);
    if (results.length) {
      return results[0];
    }
    logger.warn(`could not find moderator with address ${address}`);
    return undefined;
  }

  async isModerator(address: string) {
    const db: Client = await getAppDB();
    const query = new Where('ethAddress').eq(address).and('active').eq(true);
    const results = await db.find<Moderator>(this.dbID, this.collection, query);
    return results.length > 0 ? true : false;
  }

  async isAdmin(address: string) {
    const db: Client = await getAppDB();
    const query = new Where('ethAddress').eq(address).and('active').eq(true).and('admin').eq(true);
    const results = await db.find<Moderator>(this.dbID, this.collection, query);
    return results.length > 0 ? true : false;
  }

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
    return db.create(this.dbID, this.collection, [moderator]);
  }
}

export default ModerationAdminAPI;
