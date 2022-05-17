import { DataSource } from 'apollo-datasource';
import {
  EMPTY_KEY,
  EMPTY_PROFILE,
  getAppDB,
  getCurrentApiProvider,
  logger,
  sendNotification,
  validateName,
} from '../helpers';
import { ThreadID, Where, Client } from '@textile/hub';
import { DataProvider, Profile } from '../collections/interfaces';
import { queryCache } from '../storage/cache';
import { clearSearchCache, searchIndex } from './search-indexes';
import { postsStats, statsProvider } from '../resolvers/constants';
import { parse, stringify } from 'flatted';
import objHash from 'object-hash';

const NOT_FOUND_PROFILE = new Error('Profile not found');
const NOT_REGISTERED = new Error('Must be registered first.');
class ProfileAPI extends DataSource {
  readonly collection: string;
  private context;
  private readonly dbID: ThreadID;
  private readonly FOLLOWING_KEY = ':getFollowing:';
  private readonly FOLLOWERS_KEY = ':getFollowers:';
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
    let pubKey;
    const key = this.getCacheKey(`:eth:${ethAddress}`);
    const hasKey = await queryCache.has(key);
    if (!hasKey) {
      const query = new Where('ethAddress').eq(ethAddress);
      const profilesFound = await db.find<Profile>(this.dbID, this.collection, query);
      if (!profilesFound.length) {
        logger.warn(`${ethAddress} not registered`);
        throw NOT_FOUND_PROFILE;
      }
      pubKey = profilesFound[0].pubKey;
      await queryCache.set(key, pubKey);
    } else {
      pubKey = await queryCache.get(key);
    }
    return this.resolveProfile(pubKey);
  }

  getCacheKey(pubKey: string) {
    return `${this.collection}:pubKey${pubKey}`;
  }
  async resolveProfile(pubKey: string, noCache = false) {
    const cacheKey = this.getCacheKey(pubKey);
    const hasKey = await queryCache.has(cacheKey);
    if (hasKey && !noCache) {
      return queryCache.get(cacheKey);
    }
    const db: Client = await getAppDB();
    const query = new Where('pubKey').eq(pubKey);
    const profilesFound = await db.find<Profile>(this.dbID, this.collection, query);
    if (noCache) {
      return profilesFound;
    }
    if (profilesFound.length) {
      const extractedFields = ['name', 'description', 'avatar', 'coverImage'];
      const q = profilesFound[0].default.filter(p => extractedFields.includes(p.property));
      for (const prov of profilesFound[0].default) {
        if (Buffer.from(prov.value, 'base64').toString('base64') === prov.value) {
          prov.value = Buffer.from(prov.value, 'base64').toString();
        }
      }

      for (const prov of profilesFound[0].providers) {
        if (Buffer.from(prov.value, 'base64').toString('base64') === prov.value) {
          prov.value = Buffer.from(prov.value, 'base64').toString();
        }
      }

      const returnedObj = parse(stringify(profilesFound[0]));
      for (const provider of q) {
        Object.assign(returnedObj, {
          [provider.property]: provider.value,
        });
      }
      const totalPostsIndex = profilesFound[0].metaData.findIndex(
        m => m.provider === statsProvider && m.property === postsStats,
      );
      const totalPosts =
        totalPostsIndex !== -1 ? profilesFound[0].metaData[totalPostsIndex].value : '0';
      const apiProvider = getCurrentApiProvider();
      const followers = await apiProvider.followerAPI.getFollowers(pubKey);
      const following = await apiProvider.followerAPI.getFollowing(pubKey);
      Object.assign(returnedObj, {
        totalPosts,
        totalFollowers: followers.total,
        totalFollowing: following.total,
        totalInterests: profilesFound[0]?.interests?.length || 0,
      });
      await queryCache.set(cacheKey, returnedObj);
      return returnedObj;
    }
    if (pubKey === EMPTY_KEY) {
      return EMPTY_PROFILE;
    }
    logger.warn(`${pubKey} not registered`);
    throw NOT_FOUND_PROFILE;
  }

  async addProfileProvider(pubKey: string, data: DataProvider[]) {
    const db: Client = await getAppDB();
    const query = new Where('pubKey').eq(pubKey);
    const profilesFound = await db.find<Profile>(this.dbID, this.collection, query);
    if (!profilesFound?.length || !data?.length) {
      logger.warn(NOT_FOUND_PROFILE);
      throw NOT_FOUND_PROFILE;
    }
    const profile = profilesFound[0];
    for (const rec of data) {
      rec.value = Buffer.from(rec.value).toString('base64');
      logger.info('saving provider', rec);
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
    await queryCache.del(this.getCacheKey(pubKey));
    return profile._id;
  }
  async makeDefaultProvider(pubKey: string, data: DataProvider[]) {
    const db: Client = await getAppDB();
    const query = new Where('pubKey').eq(pubKey);
    const profilesFound = await db.find<Profile>(this.dbID, this.collection, query);
    if (!profilesFound?.length) {
      logger.warn(`${pubKey} not registered`);
      throw NOT_REGISTERED;
    }
    const profile = profilesFound[0];
    for (const rec of data) {
      rec.value = Buffer.from(rec.value).toString('base64');
      const indexFound = profile.default.findIndex(provider => provider.property === rec.property);
      if (indexFound !== -1) {
        profile.default[indexFound] = rec;
      } else {
        profile.default.push(rec);
      }
    }
    await db.save(this.dbID, this.collection, [profile]);
    await queryCache.del(this.getCacheKey(pubKey));
    const name = profile.default.find(p => p.property === 'name')?.value;
    searchIndex
      .saveObject({
        objectID: profile._id,
        category: 'profile',
        userName: profile.userName,
        pubKey: profile.pubKey,
        name: name ? Buffer.from(name, 'base64').toString() : '',
        creationDate: profile.creationDate,
      })
      .then(_ => _)
      // tslint:disable-next-line:no-console
      .catch(e => console.error(e));
    await clearSearchCache();
    return profile._id;
  }

  async registerUserName(pubKey: string, name: string) {
    const db: Client = await getAppDB();
    const validatedName = validateName(name);
    const query = new Where('userName').eq(validatedName);
    const profilesFound = await db.find<Profile>(this.dbID, this.collection, query);
    if (profilesFound.length && profilesFound[0].pubKey !== pubKey) {
      logger.warn(`userName ${name} already taken`);
      throw new Error('userName already taken');
    }

    const query1 = new Where('pubKey').eq(pubKey);
    const profilesFound1 = await db.find<Profile>(this.dbID, this.collection, query1);
    if (!profilesFound1?.length) {
      logger.warn(`${pubKey} not registered`);
      throw NOT_REGISTERED;
    }
    const profile = profilesFound1[0];

    profile.userName = validatedName;
    await db.save(this.dbID, this.collection, [profile]);
    await queryCache.del(this.getCacheKey(pubKey));
    searchIndex
      .saveObject({
        objectID: profile._id,
        category: 'profile',
        userName: validatedName,
        pubKey: profile.pubKey,
        creationDate: profile.creationDate,
      })
      .then(_ => _)
      // tslint:disable-next-line:no-console
      .catch(e => console.error(e));
    return profile._id;
  }

  async saveMetadata(pubKey: string, data: DataProvider) {
    const db: Client = await getAppDB();
    const query = new Where('pubKey').eq(pubKey);
    const profilesFound = await db.find<Profile>(this.dbID, this.collection, query);
    if (!profilesFound?.length) {
      logger.warn(NOT_REGISTERED);
      throw NOT_REGISTERED;
    }
    const profile = profilesFound[0];
    data.value = encodeURIComponent(data.value);
    const indexFound = profile.metaData.findIndex(
      p => p.property === data.property && p.provider === data.provider,
    );
    if (indexFound !== -1) {
      profile.metaData[indexFound] = data;
    } else {
      profile.metaData.push(data);
    }

    await db.save(this.dbID, this.collection, [profile]);
    await queryCache.del(this.getCacheKey(pubKey));
    return profile._id;
  }
  async searchProfiles(name: string) {
    const result = await searchIndex.search<{ pubKey: string }>(name, {
      facetFilters: ['category:profile'],
      hitsPerPage: 20,
      restrictSearchableAttributes: ['name', 'userName', 'pubKey'],
      attributesToRetrieve: ['name', 'pubKey', 'userName'],
    });
    const results = [];
    for (const profile of result.hits) {
      const resolvedProfile = await this.resolveProfile(profile.pubKey);
      results.push(resolvedProfile);
    }
    return results;
  }

  async updateProfile(updateProfile: Profile[]) {
    const db: Client = await getAppDB();
    return db.save(this.dbID, this.collection, updateProfile);
  }

  /**
   *
   * @param pubKey
   * @param tagName
   */
  async toggleInterestSub(pubKey: string, tagName: string) {
    const db: Client = await getAppDB();
    const query = new Where('pubKey').eq(pubKey);
    const [profile] = await db.find<Profile>(this.dbID, this.collection, query);
    if (!profile) {
      throw NOT_REGISTERED;
    }
    if (!profile?.interests || !profile.interests.length) {
      profile.interests = [tagName];
    } else {
      const position = profile.interests.indexOf(tagName);
      if (position === -1) {
        profile.interests.unshift(tagName);
      } else {
        profile.interests.splice(position, 1);
      }
    }
    const objID = objHash({ [profile._id]: tagName });
    await db.save(this.dbID, this.collection, [profile]);
    await queryCache.del(this.getCacheKey(pubKey));
    const isSubscribed = profile.interests[0] === tagName;
    if (isSubscribed) {
      searchIndex
        .saveObject({
          objectID: objID,
          category: 'interests',
          tagName: tagName,
          pubKey: profile.pubKey,
        })
        .then(_ => _)
        .catch(e => console.error(e));
    } else {
      searchIndex.deleteObject(objID);
    }

    return isSubscribed;
  }

  async getInterests(pubKey: string) {
    const db: Client = await getAppDB();
    const query = new Where('pubKey').eq(pubKey);
    const [profile] = await db.find<Profile>(this.dbID, this.collection, query);
    if (!profile) {
      throw NOT_REGISTERED;
    }
    if (!profile?.interests || !profile.interests.length) {
      return [];
    }
    return profile.interests;
  }

  async getProfiles() {
    const db: Client = await getAppDB();
    return db.find<Profile>(this.dbID, this.collection, {
      sort: { desc: true, fieldPath: 'creationDate' },
    });
  }
}

export default ProfileAPI;
