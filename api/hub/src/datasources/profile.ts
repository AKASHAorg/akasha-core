import { DataSource } from 'apollo-datasource';
import { getAppDB } from '../helpers';
import { ThreadID, Where, Client } from '@textile/hub';
import { DataProvider, Profile } from '../collections/interfaces';
import { queryCache } from '../storage/cache';

class ProfileAPI extends DataSource {
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
  async getProfile(ethAddress: string) {
    const db: Client = await getAppDB();
    const query = new Where('ethAddress').eq(ethAddress);
    const profilesFound = await db.find<Profile>(this.dbID, this.collection, query);
    if (profilesFound.length) {
      return profilesFound[0];
    }
    return;
  }

  getCacheKey(pubKey: string) {
    return `${this.collection}:pubKey${pubKey}`;
  }
  async resolveProfile(pubKey: string) {
    const cacheKey = this.getCacheKey(pubKey);
    if (queryCache.has(cacheKey)) {
      return Promise.resolve(queryCache.get(cacheKey));
    }
    const db: Client = await getAppDB();
    const query = new Where('pubKey').eq(pubKey);
    const profilesFound = await db.find<Profile>(this.dbID, this.collection, query);
    if (profilesFound.length) {
      queryCache.set(cacheKey, profilesFound[0]);
      return profilesFound[0];
    }
    return;
  }

  async addProfileProvider(pubKey: string, data: DataProvider[]) {
    const db: Client = await getAppDB();
    const query = new Where('pubKey').eq(pubKey);
    const profilesFound = await db.find<Profile>(this.dbID, this.collection, query);
    if (!profilesFound?.length) {
      return;
    }
    const profile = profilesFound[0];
    for (const rec of data) {
      const existing = profile.providers.findIndex(
        d => d.provider === rec.provider && d.property === rec.property,
      );
      if (existing !== -1) {
        profile.providers[existing] = rec;
      } else {
        profile.providers.unshift(rec);
      }
    }
    await db.save(this.dbID, this.collection, [profile]);
    queryCache.del(this.getCacheKey(pubKey));
    return profile._id;
  }
  async makeDefaultProvider(pubKey: string, data: DataProvider) {
    const db: Client = await getAppDB();
    const query = new Where('pubKey').eq(pubKey);
    const profilesFound = await db.find<Profile>(this.dbID, this.collection, query);
    if (!profilesFound?.length) {
      return;
    }
    const profile = profilesFound[0];

    const indexFound = profile.default.findIndex(provider => provider.property === data.property);
    if (indexFound !== -1) {
      profile.default[indexFound] = data;
    } else {
      profile.default.push(data);
    }
    await db.save(this.dbID, this.collection, [profile]);
    queryCache.del(this.getCacheKey(pubKey));
    return profile._id;
  }

  async registerUserName(pubKey: string, name: string) {
    const db: Client = await getAppDB();
    const query = new Where('userName').eq(name);
    const profilesFound = await db.find<Profile>(this.dbID, this.collection, query);
    if (profilesFound.length) {
      return;
    }
    const query1 = new Where('pubKey').eq(pubKey);
    const profilesFound1 = await db.find<Profile>(this.dbID, this.collection, query1);
    if (!profilesFound1?.length) {
      return;
    }
    const profile = profilesFound1[0];
    if (!profile) {
      return;
    }

    profile.userName = name;
    await db.save(this.dbID, this.collection, [profile]);
    queryCache.del(this.getCacheKey(pubKey));
    return profile._id;
  }
  async followProfile(pubKey: string, ethAddress: string) {
    const db: Client = await getAppDB();
    const query = new Where('ethAddress').eq(ethAddress);
    const [profile] = await db.find<Profile>(this.dbID, this.collection, query);

    const query1 = new Where('pubKey').eq(pubKey);
    const [profile1] = await db.find<Profile>(this.dbID, this.collection, query1);
    const exists = profile1.following.indexOf(profile.pubKey);
    const exists1 = profile.followers.indexOf(profile1.pubKey);
    if (!profile || !profile1 || exists !== -1 || exists1 !== -1) {
      return false;
    }

    profile1.following.unshift(profile.pubKey);
    profile.followers.unshift(profile1.pubKey);
    await db.save(this.dbID, this.collection, [profile, profile1]);
    queryCache.del(this.getCacheKey(pubKey));
    return true;
  }

  async unFollowProfile(pubKey: string, ethAddress: string) {
    const db: Client = await getAppDB();
    const query = new Where('ethAddress').eq(ethAddress);
    const [profile] = await db.find<Profile>(this.dbID, this.collection, query);

    const query1 = new Where('pubKey').eq(pubKey);
    const [profile1] = await db.find<Profile>(this.dbID, this.collection, query1);
    const exists = profile1.following.indexOf(profile.pubKey);
    const exists1 = profile.followers.indexOf(profile1.pubKey);
    if (!profile || !profile1 || exists === -1 || exists1 === -1) {
      return false;
    }
    profile1.following.splice(exists, 1);
    profile.followers.splice(exists1, 1);
    await db.save(this.dbID, this.collection, [profile, profile1]);
    queryCache.del(this.getCacheKey(pubKey));
    return true;
  }

  async saveMetadata(pubKey: string, data: DataProvider) {
    const db: Client = await getAppDB();
    const query = new Where('pubKey').eq(pubKey);
    const profilesFound = await db.find<Profile>(this.dbID, this.collection, query);
    if (!profilesFound?.length) {
      return;
    }
    const profile = profilesFound[0];
    const indexFound = profile.metaData.findIndex(
      p => p.property === data.property && p.provider === data.provider,
    );
    if (indexFound !== -1) {
      profile.metaData[indexFound] = data;
    } else {
      profile.metaData.push(data);
    }

    await db.save(this.dbID, this.collection, [profile]);
    queryCache.del(this.getCacheKey(pubKey));
    return profile._id;
  }
}

export default ProfileAPI;
