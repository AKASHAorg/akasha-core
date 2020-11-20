import { DataSource } from 'apollo-datasource';
import { getAppDB } from '../helpers';
import { ThreadID, Where, Client } from '@textile/hub';
import { DataProvider, Profile } from '../collections/interfaces';

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
    this.db = await getAppDB();
  }
  async refreshDB() {
    // @ts-ignore
    if (this.db.context.isExpired) {
      this.db = await getAppDB();
    }
  }
  async getProfile(ethAddress: string) {
    await this.refreshDB();
    const query = new Where('ethAddress').eq(ethAddress);
    const profilesFound = await this.db.find<Profile>(this.dbID, this.collection, query);
    if (profilesFound.length) {
      return profilesFound[0];
    }
    return;
  }

  async resolveProfile(pubKey: string) {
    await this.refreshDB();
    const query = new Where('pubKey').eq(pubKey);
    const profilesFound = await this.db.find<Profile>(this.dbID, this.collection, query);
    if (profilesFound.length) {
      return profilesFound[0];
    }
    return;
  }

  async addProfileProvider(pubKey: string, data: DataProvider[]) {
    await this.refreshDB();
    const profile = await this.resolveProfile(pubKey);
    if (!profile) {
      return;
    }
    profile.providers = profile.providers.concat(data);
    return await this.db.save(this.dbID, this.collection, [profile]);
  }
  async makeDefaultProvider(pubKey: string, data: DataProvider) {
    await this.refreshDB();
    const profile = await this.resolveProfile(pubKey);
    if (!profile) {
      return;
    }
    const indexFound = profile.default.findIndex(provider => provider.property === data.property);
    if (indexFound !== -1) {
      profile.default[indexFound] = data;
    } else {
      profile.default.push(data);
    }
    return await this.db.save(this.dbID, this.collection, [profile]);
  }

  async registerUserName(pubKey: string, name: string) {
    await this.refreshDB();
    const query = new Where('userName').eq(name);
    const profilesFound = await this.db.find<Profile>(this.dbID, this.collection, query);
    if (profilesFound.length) {
      return;
    }
    const profile = await this.resolveProfile(pubKey);
    if (!profile) {
      return;
    }
    profile.userName = name;
    return await this.db.save(this.dbID, this.collection, [profile]);
  }
}

export default ProfileAPI;
