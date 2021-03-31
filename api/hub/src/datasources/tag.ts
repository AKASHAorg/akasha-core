import { DataSource } from 'apollo-datasource';
import { getAppDB, logger } from '../helpers';
import { Client, ThreadID, Where } from '@textile/hub';
import { Tag } from '../collections/interfaces';
import { queryCache } from '../storage/cache';
import { searchIndex } from './search-indexes';

class TagAPI extends DataSource {
  private readonly collection: string;
  private context: any;
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
  }

  async searchTags(name: string) {
    const result = await searchIndex.search(name, {
      facetFilters: ['category:tag'],
      hitsPerPage: 20,
      attributesToRetrieve: ['name'],
    });
    const tags = result.hits.map((element: any) => {
      return element.name;
    });
    const results = [];
    for (const tag of tags) {
      const tagData = await this.getTag(tag);
      results.push({ name: tag, totalPosts: tagData?.posts?.length || 0 });
    }
    return results.sort((x, y) => y.totalPosts - x.totalPosts);
  }

  async getTag(name: string) {
    const db: Client = await getAppDB();
    const formattedName = name.toLowerCase();
    const query = new Where('name').eq(formattedName);
    const tag = await db.find<Tag>(this.dbID, this.collection, query);
    if (tag.length) {
      return tag[0];
    }
    return;
  }

  // threadsdb doesn't have limit and offset selectors atm
  // https://github.com/textileio/js-threads/issues/140
  async getTags(limit: number, offset: string) {
    let tag: Tag[];
    const db: Client = await getAppDB();
    if (await queryCache.has(this.collection)) {
      tag = await queryCache.get(this.collection);
    } else {
      tag = await db.find<Tag>(this.dbID, this.collection, {
        sort: { desc: true, fieldPath: 'creationDate' },
      });
      await queryCache.set(this.collection, tag);
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
    const db: Client = await getAppDB();
    const postExists = await db.has(this.dbID, postsCollection, [postID]);
    logger.info(`indexing tags for post: ${postID} -- ${tagName}`);
    if (!postExists) {
      return Promise.reject(`postID: ${postID} was not found`);
    }
    let tag = await this.getTag(tagName);

    if (!tag) {
      await this.addTag(tagName);
      tag = await this.getTag(tagName);
    }
    tag.posts.unshift(postID);
    return await db.save(this.dbID, this.collection, [tag]);
  }

  async indexComment(commentsCollection: string, commentID: string, tagName: string) {
    const db: Client = await getAppDB();
    const postExists = await db.has(this.dbID, commentsCollection, [commentID]);
    if (!postExists) {
      return Promise.reject(`commentID: ${commentID} was not found`);
    }
    let tag = await this.getTag(tagName);

    if (!tag) {
      await this.addTag(tagName);
      tag = await this.getTag(tagName);
    }
    tag.comments.unshift(commentID);
    return await db.save(this.dbID, this.collection, [tag]);
  }

  async addTag(name: string) {
    const db: Client = await getAppDB();
    const formattedName = name.toLowerCase();
    if (formattedName.length > 32) {
      return Promise.reject('Tags can have a maximum of 32 characters!');
    }
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
      creationDate: new Date().toISOString(),
      _id: '',
      posts: [],
      comments: [],
    };
    const tagID = await db.create(this.dbID, this.collection, [tag]);
    if (!tagID || !tagID.length) {
      return;
    }
    searchIndex
      .saveObject({
        objectID: tagID[0],
        name: tag.name,
        creationDate: tag.creationDate,
        category: 'tag',
      })
      .then(_ => _)
      // tslint:disable-next-line:no-console
      .catch(e => console.error(e));
    await queryCache.del(this.collection);
    return tagID[0];
  }
}

export default TagAPI;
