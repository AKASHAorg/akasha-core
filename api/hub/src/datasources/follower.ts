import { DataSource } from 'apollo-datasource';
import { getAppDB, logger, sendNotification } from '../helpers';
import { Client, ThreadID, Where } from '@textile/hub';
import { DataProvider, Follower, Profile } from '../collections/interfaces';
import { queryCache } from '../storage/cache';

class FollowerAPI extends DataSource {
  private readonly collection: string;
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

  getCacheKey(pubKey: string) {
    return `${this.collection}:pubKey${pubKey}`;
  }

  async followProfile(pubKey: string, following: string) {
    const db: Client = await getAppDB();
    const t = db.writeTransaction(this.dbID, this.collection);
    await t.start();
    const query = new Where('follower').eq(pubKey).and('following').eq(following);
    const [followRecord] = await t.find<Follower>(query);

    if (followRecord) {
      if (!followRecord.active) {
        followRecord.active = true;
        await t.save([followRecord]);
        await t.end();
      }
      return true;
    }

    const record = {
      creationDate: new Date().getTime(),
      follower: pubKey,
      following: following,
      active: true,
      metaData: [],
    };

    await t.create([record]);
    await t.end();

    const followingKey = this.getCacheKey(`${this.FOLLOWING_KEY}${pubKey}`);
    const followersKey = this.getCacheKey(`${this.FOLLOWERS_KEY}${following}`);

    const followersList = await queryCache.get(followersKey);
    const followingList = await queryCache.get(followingKey);

    if (Array.isArray(followersList)) {
      if (!followersList.includes(pubKey)) {
        followersList.push(pubKey);
        await queryCache.set(followersKey, followersList);
      }
    } else {
      await queryCache.set(followersKey, [pubKey]);
    }

    if (Array.isArray(followingList)) {
      if (!followingList.includes(following)) {
        followingList.push(following);
        await queryCache.set(followingKey, followingList);
      }
    } else {
      await queryCache.set(followingKey, [following]);
    }

    // @Todo: turn back on after migration
    // const notification = {
    //   property: 'NEW_FOLLOWER',
    //   provider: 'awf.graphql.profile.api',
    //   value: {
    //     follower: pubKey,
    //   },
    // };
    //await sendNotification(following, notification);
    return true;
  }

  async unFollowProfile(pubKey: string, unFollowing: string) {
    const db: Client = await getAppDB();
    const t = db.writeTransaction(this.dbID, this.collection);
    await t.start();
    const query = new Where('follower').eq(pubKey).and('following').eq(unFollowing);
    const [followRecord] = await t.find<Follower>(query);

    if (!followRecord || !followRecord.active) {
      await t.end();
      return true;
    }

    followRecord.active = false;
    await t.save([followRecord]);
    await t.end();

    const followingKey = this.getCacheKey(`${this.FOLLOWING_KEY}${pubKey}`);
    const followersKey = this.getCacheKey(`${this.FOLLOWERS_KEY}${unFollowing}`);
    const followers = await queryCache.get(followersKey);
    const following = await queryCache.get(followingKey);

    if (Array.isArray(followers)) {
      const newFollowerList = followers.filter(e => e !== pubKey);
      await queryCache.set(followersKey, newFollowerList);
    } else {
      await queryCache.del(followersKey);
    }

    if (Array.isArray(following)) {
      const newFollowingList = following.filter(e => e !== unFollowing);
      await queryCache.set(followingKey, newFollowingList);
    } else {
      await queryCache.del(followingKey);
    }

    return true;
  }

  /**
   * @param pubKey
   * @param limit
   * @param offset
   */
  async getFollowers(pubKey: string, limit = 5, offset = 0) {
    const db: Client = await getAppDB();
    const key = this.getCacheKey(`${this.FOLLOWERS_KEY}${pubKey}`);
    const hasAllFollowersCache = await queryCache.has(key);
    let followers: string[];
    if (!hasAllFollowersCache) {
      const query = new Where('following').eq(pubKey).and('active').eq(true);
      const followersFound = await db.find<Follower>(this.dbID, this.collection, query);
      const followersList = followersFound.map(f => f.follower);
      await queryCache.set(key, followersList);
      followers = followersList;
    } else {
      followers = await queryCache.get(key);
    }
    if (!followers?.length) {
      return { results: [], nextIndex: undefined, total: 0 };
    }
    let nextIndex = limit + offset;
    if (followers.length <= nextIndex) {
      nextIndex = undefined;
    }
    const results = followers.slice(offset, nextIndex);
    return { results: results, nextIndex: nextIndex, total: followers.length };
  }

  async isFollowing(follower: string, following: string) {
    const db: Client = await getAppDB();
    const key = this.getCacheKey(`${this.FOLLOWERS_KEY}${following}`);
    const hasAllFollowersCache = await queryCache.has(key);
    if (hasAllFollowersCache) {
      const followersList = await queryCache.get(key);
      if (Array.isArray(followersList)) {
        return followersList.includes(follower);
      }
    }
    const query = new Where('follower')
      .eq(follower)
      .and('following')
      .eq(following)
      .and('active')
      .eq(true);
    const followerFound = await db.find<Follower>(this.dbID, this.collection, query);
    return !!followerFound.length;
  }
  /**
   *
   * @param pubKey
   * @param limit
   * @param offset
   */
  async getFollowing(pubKey: string, limit = 5, offset = 0) {
    const db: Client = await getAppDB();
    const key = this.getCacheKey(`${this.FOLLOWING_KEY}${pubKey}`);
    const hasAllFollowingCache = await queryCache.has(key);
    let following: string[];
    if (!hasAllFollowingCache) {
      const query = new Where('follower').eq(pubKey).and('active').eq(true);
      const followingFound = await db.find<Follower>(this.dbID, this.collection, query);
      const followingList = followingFound.map(f => f.following);
      await queryCache.set(key, followingList);
      following = followingList;
    } else {
      following = await queryCache.get(key);
    }
    if (!following?.length) {
      return { results: [], nextIndex: undefined, total: 0 };
    }
    let nextIndex = limit + offset;
    if (following.length <= nextIndex) {
      nextIndex = undefined;
    }

    const results = following.slice(offset, nextIndex);
    return { results: results, nextIndex: nextIndex, total: following.length };
  }
}

export default FollowerAPI;
