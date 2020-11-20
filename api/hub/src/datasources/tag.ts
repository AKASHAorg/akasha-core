import { DataSource } from 'apollo-datasource';
import { getAppDB } from '../helpers';
import { Client, ThreadID, Where } from '@textile/hub';
import { Tag } from '../collections/interfaces';
import { queryCache } from '../storage/cache';

class TagAPI extends DataSource {
  private readonly collection: string;
  private context: any;
  private db: Client;
  private readonly dbID: ThreadID;
  private format: RegExp;
  private allowedChars: RegExp;
  constructor({ collection, dbID }) {
    super();
    this.collection = collection;
    this.dbID = dbID;
    this.format = /^(?=^[a-z0-9])(?=.*[a-z0-9]$).*$/;
    this.allowedChars = /^[a-z0-9\-.]+$/;
  }

  async initialize(config) {
    this.context = config.context;
    this.db = await getAppDB();
  }

  async getTag(name: string) {
    const formattedName = name.toLowerCase();
    const query = new Where('name').eq(formattedName);
    const tag = await this.db.find<Tag>(this.dbID, this.collection, query);
    if (tag.length) {
      return tag[0];
    }
    return;
  }

  // threadsdb doesn't have limit and offset selectors atm
  // https://github.com/textileio/js-threads/issues/140
  async getTags(limit: number, offset: string) {
    let tag: Tag[];
    if (queryCache.has(this.collection)) {
      tag = queryCache.get(this.collection);
    } else {
      tag = await this.db.find<Tag>(this.dbID, this.collection, {
        sort: { desc: true, fieldPath: 'creationDate' },
      });
      queryCache.set(this.collection, tag);
    }
    const offsetIndex = offset ? tag.findIndex(tagItem => tagItem._id === offset) : 0;
    let endIndex = limit + offsetIndex;
    if (tag.length <= endIndex) {
      endIndex = undefined;
    }
    const results = tag.slice(offsetIndex, endIndex);
    const nextIndex = endIndex ? tag[endIndex]._id : null;
    return { results: results, nextIndex: nextIndex, total: tag.length };
  }

  async indexPost(postsCollection: string, postID: string, tagName: string) {
    const postExists = await this.db.has(this.dbID, postsCollection, [postID]);
    if (!postExists) {
      return Promise.reject(`postID: ${postID} was not found`);
    }
    let tag = await this.getTag(tagName);

    if (!tag) {
      await this.addTag(tagName);
      tag = await this.getTag(tagName);
    }
    tag.posts.unshift(postID);
    return await this.db.save(this.dbID, this.collection, [tag]);
  }

  async addTag(name: string) {
    const formattedName = name.toLowerCase();
    // starts with alpha-num and ends with alpha-num
    if (!this.format.test(formattedName)) {
      return Promise.reject('Tags must start and end with alphanumeric character!');
    }

    // contains only alpha-num and - .
    if (!this.allowedChars.test(formattedName)) {
      return Promise.reject('Tags can contain only alphanumeric, hyphen and dot!');
    }

    const exists = await this.getTag(formattedName);
    if (exists) {
      return;
    }
    const tag: Tag = {
      name: formattedName,
      creationDate: new Date().getTime(),
      _id: '',
      posts: [],
      comments: [],
    };
    const tagID = await this.db.create(this.dbID, this.collection, [tag]);
    if (!tagID || !tagID.length) {
      return;
    }
    return tagID[0];
  }
}

export default TagAPI;
