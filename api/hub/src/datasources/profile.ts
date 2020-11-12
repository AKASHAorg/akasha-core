import { DataSource } from 'apollo-datasource';
import { initAppDB } from '../helpers';
import { ThreadID, Where, Client } from '@textile/hub';
import { Profile } from '../collections/interfaces';

class ProfileAPI extends DataSource {
  private readonly collection: string;
  private context: any;
  private db: Client;
  private readonly dbID: ThreadID;
  constructor({ collection, dbID }) {
    super();
    this.collection = collection;
    this.dbID = dbID;
  }

  async initialize(config) {
    this.context = config.context;
    this.db = await initAppDB();
  }

  async getProfile(ethAddress: string) {
    const query = new Where('ethAddress').eq(ethAddress);
    const profilesFound = await this.db.find<Profile>(this.dbID, this.collection, query);
    if (profilesFound.length) {
      return profilesFound[0];
    }
    return {};
  }
}

export default ProfileAPI;
