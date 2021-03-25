import { DataSource } from 'apollo-datasource';
import { getAppDB, getMailSender, logger } from '../helpers';
import { Client, ThreadID } from '@textile/hub';
import { DataProvider, PostItem } from '../collections/interfaces';
import { queryCache } from '../storage/cache';
import { searchIndex } from './search-indexes';

class PostAPI extends DataSource {
  private readonly collection: string;
  private context: any;
  private readonly dbID: ThreadID;
  private readonly allPostsCache: string;
  private readonly quotedByPost = 'quoted.by.post';
  private readonly graphqlPostsApi = 'awf.graphql.posts.api';
  constructor({ collection, dbID }) {
    super();
    this.collection = collection;
    this.dbID = dbID;
    this.allPostsCache = `${this.collection}:limit:offset`;
  }

  async initialize(config) {
    this.context = config.context;
  }

  getPostCacheKey(id) {
    return `${this.collection}:postID${id}`;
  }

  async getPost(id: string, pubKey?: string, stopIter = false) {
    const db: Client = await getAppDB();
    const cacheKey = this.getPostCacheKey(id);
    if (await queryCache.has(cacheKey)) {
      return queryCache.get(cacheKey);
    }
    const post = await db.findByID<PostItem>(this.dbID, this.collection, id);
    if (!post) {
      return;
    }
    const quotedBy = post?.metaData
      ?.filter(item => item.property === this.quotedByPost)
      ?.map(item => item.value);
    const result = JSON.parse(JSON.stringify(Object.assign({}, post, { quotedBy })));
    if (result?.quotes?.length && !stopIter) {
      result.quotes = await Promise.all(
        result.quotes.map(postID => this.getPost(postID, pubKey, true)),
      );
    }
    await queryCache.set(cacheKey, result);
    return result;
  }
  async getPosts(limit: number, offset: string, pubKey?: string) {
    let posts;
    const db: Client = await getAppDB();
    if (!(await queryCache.has(this.allPostsCache))) {
      posts = await db.find<PostItem>(this.dbID, this.collection, {
        sort: { desc: true, fieldPath: 'creationDate' },
      });
      await queryCache.set(
        this.allPostsCache,
        posts.map(p => p._id),
      );
    }
    posts = await queryCache.get(this.allPostsCache);
    const fetchedPosts = [];

    const offsetIndex = offset ? posts.findIndex(postItem => postItem === offset) : 0;
    let endIndex = limit + offsetIndex;
    if (posts.length <= endIndex) {
      endIndex = undefined;
    }
    const results = posts.slice(offsetIndex, endIndex);
    const nextIndex = endIndex ? posts[endIndex] : null;
    for (const postID of results) {
      const post = await this.getPost(postID, pubKey);
      fetchedPosts.push(post);
    }
    return { results: fetchedPosts, nextIndex: nextIndex, total: posts.length };
  }
  async createPost(
    author: string,
    content: DataProvider[],
    opt?: {
      title?: string;
      tags?: string[];
      quotes?: string[];
      type?: string;
      mentions?: string[];
    },
  ) {
    const db: Client = await getAppDB();
    if (!author) {
      throw new Error('Not authorized');
    }
    const post: PostItem = {
      _id: '',
      creationDate: new Date().getTime(),
      author: author,
      type: opt.type || 'DEFAULT',
      content: Array.from(content),
      title: opt.title,
      tags: opt.tags ? Array.from(opt.tags) : [],
      quotes: opt.quotes ? Array.from(opt.quotes) : [],
      mentions: opt.mentions ? Array.from(opt.mentions) : [],
      metaData: [
        {
          property: 'version',
          provider: this.graphqlPostsApi,
          value: '1',
        },
      ],
    };
    if (opt?.quotes?.length) {
      for (const quoteID of opt.quotes) {
        const postExists = await db.has(this.dbID, this.collection, [quoteID]);
        if (!postExists) {
          logger.error('could not save post', post);
          throw new Error('Quoted post does not exist');
        }
      }
    }
    logger.info('saving a new post:', post);
    const postID = await db.create(this.dbID, this.collection, [post]);
    logger.info('created a new post:', postID);
    const currentPosts = await queryCache.get(this.allPostsCache);
    if (currentPosts.length) {
      currentPosts.unshift(postID[0]);
      await queryCache.set(this.allPostsCache, currentPosts);
    }
    await this.addQuotes(post.quotes, postID[0], author);
    if (post.mentions && post.mentions.length) {
      await this.triggerMentions(post.mentions, postID[0], post.author);
    }
    searchIndex
      .saveObject({
        objectID: postID[0],
        type: post.type,
        author: post.author,
        tags: post.tags,
        category: 'post',
        creationDate: post.creationDate,
        content: post.content.find(e => e.property === 'textContent')?.value,
        title: post.title,
      })
      .then(_ => logger.info('indexed post:', postID))
      // tslint:disable-next-line:no-console
      .catch(e => logger.error(e));
    return postID;
  }

  async triggerMentions(mentions: string[], postID, author) {
    const notification = {
      property: 'POST_MENTION',
      provider: 'awf.graphql.posts.api',
      value: {
        postID,
        author,
      },
    };
    for (const recipient of mentions) {
      await this.sendNotification(recipient, notification);
    }
  }
  async sendNotification(
    recipient: string,
    notification: { property: string; provider: string; value: any },
  ) {
    if (recipient === notification?.value?.author) {
      return;
    }
    const mailSender = await getMailSender();
    const textEncoder = new TextEncoder();
    const encodedNotification = textEncoder.encode(JSON.stringify(notification));
    logger.info('sending notification to', recipient);
    await mailSender.sendMessage(recipient, encodedNotification);
  }
  async addQuotes(quotedPosts: string[], postID: string, author: string) {
    const db: Client = await getAppDB();
    const updatePosts = [];
    for (const quotedPost of quotedPosts) {
      const post = await db.findByID<PostItem>(this.dbID, this.collection, quotedPost);
      if (!post) {
        continue;
      }

      if (!post.metaData || !post.metaData.length) {
        post.metaData = [];
      }
      post.metaData.push({
        property: this.quotedByPost,
        provider: this.graphqlPostsApi,
        value: postID,
      });
      logger.info('adding quotes:', quotedPost);
      updatePosts.push(post);
    }
    if (updatePosts.length) {
      await db.save(this.dbID, this.collection, updatePosts);
      for (const post of updatePosts) {
        const notificationObj = {
          property: 'POST_QUOTE',
          provider: 'awf.graphql.posts.api',
          value: {
            postID,
            author,
            quotedPost: post._id,
          },
        };
        await this.sendNotification(post.author, notificationObj);
        await queryCache.del(this.getPostCacheKey(post._id));
      }
    }
    updatePosts.length = 0;
    return Promise.resolve();
  }
  async updatePosts(updatePosts: any[]) {
    const db: Client = await getAppDB();
    return db.save(this.dbID, this.collection, updatePosts);
  }
  async getRealPost(postID: string) {
    const db: Client = await getAppDB();
    return await db.findByID<PostItem>(this.dbID, this.collection, postID);
  }
  async removePosts(id: string[]) {
    const db: Client = await getAppDB();
    await db.delete(this.dbID, this.collection, id);
  }

  async getPostsByAuthor(pubKey: string, offset: number = 0, length: number = 10) {
    const result = await searchIndex.search(`${pubKey} `, {
      facetFilters: ['category:post'],
      length: length,
      offset: offset,
      restrictSearchableAttributes: ['author'],
      typoTolerance: false,
      distinct: true,
      attributesToRetrieve: ['objectID'],
    });
    const nextIndex = result?.hits?.length ? result.hits.length + offset : null;

    return { results: result.hits, nextIndex: nextIndex, total: result.nbHits };
  }

  async getPostsByTag(tagName: string, offset: number = 0, length: number = 10) {
    const result = await searchIndex.search(`${tagName} `, {
      facetFilters: ['category:post'],
      length: length,
      offset: offset,
      restrictSearchableAttributes: ['tags'],
      typoTolerance: false,
      distinct: true,
      attributesToRetrieve: ['objectID'],
    });
    const nextIndex = result?.hits?.length ? result.hits.length + offset : null;

    return { results: result.hits, nextIndex: nextIndex, total: result.nbHits };
  }

  async globalSearch(keyword: string) {
    const result = await searchIndex.search(keyword, {
      typoTolerance: false,
      distinct: true,
      maxValuesPerFacet: 80,
      hitsPerPage: 80,
      attributesToRetrieve: ['objectID', 'category', 'name', 'pubKey'],
    });
    const acc = {
      post: [],
      tag: [],
      comment: [],
      profile: [],
    };
    for (const rec of result.hits) {
      const { category, name, pubKey }: any = rec;
      if (acc.hasOwnProperty(category)) {
        acc[category].push({ id: pubKey || rec.objectID, name: name });
      }
    }

    return {
      posts: acc.post,
      tags: acc.tag,
      comments: acc.comment,
      profiles: acc.profile,
    };
  }
}

export default PostAPI;
