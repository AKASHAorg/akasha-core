import { DataSource } from 'apollo-datasource';
import { getAppDB, logger, sendAuthorNotification } from '../helpers';
import { Client, ThreadID } from '@textile/hub';
import { DataProvider, PostItem } from '../collections/interfaces';
import { parse, stringify } from 'flatted';
import { queryCache } from '../storage/cache';
import { clearSearchCache, searchIndex } from './search-indexes';

class PostAPI extends DataSource {
  private readonly collection: string;
  private context: any;
  private readonly dbID: ThreadID;
  private readonly allPostsCache: string;
  private readonly quotedByPost = 'quoted.by.post';
  private readonly graphqlPostsApi = 'awf.graphql.posts.api';
  private readonly graphqlPostVersion = 'awf.post.version.content';
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

  getInitialPostCacheKey(id) {
    return `${this.collection}:postID${id}:initial`;
  }

  getAuthorCacheKeys(pubKey: string) {
    return `${this.collection}:author:pubKey:${pubKey}`;
  }

  /**
   *
   * @param pubKey
   * @param cacheKey
   */
  async storeCacheKey(pubKey: string, cacheKey: string) {
    if (!pubKey || !cacheKey) {
      return Promise.resolve();
    }
    const key = this.getAuthorCacheKeys(pubKey);
    await queryCache.sAdd(key, cacheKey);
  }

  /**
   *
   * @param pubKey
   */
  async invalidateStoredCachedKeys(pubKey: string) {
    if (!pubKey) {
      return Promise.resolve();
    }
    const key = this.getAuthorCacheKeys(pubKey);
    let record;
    while ((record = await queryCache.sPop(key))) {
      if (!record) {
        break;
      }
      await queryCache.del(record);
    }
  }

  async getPost(id: string, pubKey?: string, stopIter = false) {
    const db: Client = await getAppDB();
    const cacheKey = this.getInitialPostCacheKey(id + stopIter);
    if (await queryCache.has(cacheKey)) {
      return queryCache.get(cacheKey);
    }
    const post = await db.findByID<PostItem>(this.dbID, this.collection, id);
    if (!post) {
      logger.warn(`Post ${id} not found`);
      throw new Error('Post not found!');
    }
    const quotedBy = post?.metaData
      ?.filter(item => item.property === this.quotedByPost)
      ?.map(item => item.value);
    const result = parse(stringify(Object.assign({}, post, { quotedBy })));
    if (result?.quotes?.length && !stopIter) {
      result.quotes = await Promise.all(
        result.quotes.map(postID => this.getPost(postID, pubKey, true)),
      );
    }
    await queryCache.set(cacheKey, result);
    await this.storeCacheKey(post.author, cacheKey);
    return result;
  }
  async getPosts(limit: number, offset: string, pubKey?: string) {
    let posts;
    const db: Client = await getAppDB();
    const hasAllPostsCache = await queryCache.has(this.allPostsCache);
    if (!hasAllPostsCache) {
      logger.info('creating redis cache');
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
          logger.warn('could not save post');
          throw new Error('Quoted post does not exist');
        }
      }
    }
    const textContent = post.content.find(e => e.property === 'textContent');
    // this is just for migration
    if (Buffer.from(textContent.value, 'base64').toString('base64') !== textContent.value) {
      textContent.value = Buffer.from(textContent.value).toString('base64');
    }
    logger.info('saving a new post');
    const postID = await db.create(this.dbID, this.collection, [post]);
    logger.info('created a new post:', postID);
    const currentPosts = await queryCache.get(this.allPostsCache);
    if (currentPosts.length) {
      currentPosts.unshift(postID[0]);
      await queryCache.set(this.allPostsCache, currentPosts);
    } else {
      await queryCache.set(this.allPostsCache, [postID[0]]);
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
        content: textContent ? Buffer.from(textContent?.value, 'base64').toString() : '',
        title: post.title,
      })
      .then(_ => logger.info(`indexed post: ${postID}`))
      // tslint:disable-next-line:no-console
      .catch(e => logger.error(e));
    await clearSearchCache();
    return postID;
  }

  /**
   * Update an existing post
   * @param author
   * @param id
   * @param content
   * @param opt
   */
  async editPost(
    author: string,
    id: string,
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
    const currentPost = await db.findByID<PostItem>(this.dbID, this.collection, id);
    if (!currentPost?._id) {
      throw new Error(`Post id ${id} not found.`);
    }

    if (currentPost.author !== author) {
      throw new Error('Not authorized');
    }
    if (currentPost?.metaData?.length) {
      currentPost.metaData.push({
        provider: this.graphqlPostsApi,
        property: this.graphqlPostVersion,
        value: Buffer.from(stringify(currentPost.content)).toString('base64'),
      });
    }
    currentPost.content = Array.from(content);
    currentPost.title = opt.title || currentPost.title;
    let removedTags = [];
    let addedTags = [];
    if (opt.tags) {
      const newTags = Array.from(opt.tags);
      removedTags = currentPost.tags.filter(t => !newTags.includes(t));
      addedTags = newTags.filter(t => !currentPost.tags.includes(t));
      currentPost.tags = newTags;
    }

    currentPost.quotes = opt.quotes ? Array.from(opt.quotes) : currentPost.quotes;
    currentPost.mentions = opt.mentions ? Array.from(opt.mentions) : opt.mentions;
    currentPost.updatedAt = new Date().getTime();
    const textContent = currentPost.content.find(e => e.property === 'textContent');
    if (Buffer.from(textContent.value, 'base64').toString('base64') !== textContent.value) {
      textContent.value = Buffer.from(textContent.value).toString('base64');
    }
    await db.save(this.dbID, this.collection, [currentPost]);
    searchIndex
      .saveObject({
        objectID: id,
        type: currentPost.type,
        author: currentPost.author,
        tags: currentPost.tags,
        category: 'post',
        creationDate: currentPost.creationDate,
        content: textContent ? Buffer.from(textContent?.value, 'base64').toString() : '',
        title: currentPost.title,
      })
      .then(_ => logger.info(`index edited post: ${id}`))
      // tslint:disable-next-line:no-console
      .catch(e => logger.error(e));
    const quotedBy = currentPost.metaData.filter(
      ds => ds.property === this.quotedByPost && ds.provider === this.graphqlPostsApi,
    );
    try {
      for (const dsRecord of quotedBy) {
        await queryCache.del(this.getPostCacheKey(dsRecord.value));
        await queryCache.del(this.getInitialPostCacheKey(dsRecord.value));
      }
      await queryCache.del(this.getPostCacheKey(id));
      await queryCache.del(this.getInitialPostCacheKey(id));
    } catch (e) {
      logger.warn('could not clear editPost cache');
    }

    return { removedTags, addedTags };
  }

  /**
   * Remove contents of a post
   * @param author
   * @param id
   */
  async deletePost(author: string, id: string) {
    const db: Client = await getAppDB();
    if (!author) {
      throw new Error('Not authorized');
    }
    const currentPost = await db.findByID<PostItem>(this.dbID, this.collection, id);
    if (!currentPost?._id) {
      throw new Error(`Post id ${id} not found.`);
    }

    if (currentPost.author !== author) {
      throw new Error('Not authorized');
    }
    currentPost.content = [
      {
        property: 'removed',
        provider: this.graphqlPostsApi,
        value: '1',
      },
    ];
    currentPost.type = 'REMOVED';
    currentPost.updatedAt = new Date().getTime();
    const removedTags = Array.from(currentPost.tags);
    currentPost.mentions = [];
    currentPost.quotes = [];
    currentPost.title = 'Removed';
    const quotedBy = currentPost.metaData.filter(
      ds => ds.property === this.quotedByPost && ds.provider === this.graphqlPostsApi,
    );
    currentPost.metaData = [];
    searchIndex
      .deleteObject(currentPost._id)
      .then(() => logger.info(`removed post: ${id}`))
      .catch(e => logger.error(e));
    await queryCache.del(this.getPostCacheKey(id));
    await queryCache.del(this.getInitialPostCacheKey(id));
    for (const dsRecord of quotedBy) {
      await queryCache.del(this.getPostCacheKey(dsRecord.value));
      await queryCache.del(this.getInitialPostCacheKey(dsRecord.value));
    }
    await db.save(this.dbID, this.collection, [currentPost]);
    return { removedTags };
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
      await sendAuthorNotification(recipient, notification);
    }
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
        await sendAuthorNotification(post.author, notificationObj);
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

  async getPostsByAuthor(pubKey: string, offset = 0, length = 10) {
    const result = await searchIndex.search(`${pubKey} `, {
      facetFilters: ['category:post', `author:${pubKey}`],
      length: length,
      offset: offset,
      typoTolerance: false,
      distinct: true,
      attributesToRetrieve: ['objectID'],
    });
    const nextIndex = result?.hits?.length ? result.hits.length + offset : null;

    return { results: result.hits, nextIndex: nextIndex, total: result.nbHits };
  }

  async getPostsByTag(tagName: string, offset = 0, length = 10) {
    const result = await searchIndex.search(``, {
      facetFilters: ['category:post', `tags:${tagName}`],
      length: length,
      offset: offset,
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

  async getPostsByAuthorsAndTags(pubKeys: string[], interests: string[], offset = 0, length = 10) {
    if (!pubKeys?.length && !interests?.length) {
      return { results: [], nextIndex: null, total: 0 };
    }
    const authorsFacet: ReadonlyArray<string> = pubKeys.map(key => `author:${key}`);
    const tagsFacet: ReadonlyArray<string> = interests.map(key => `tags:${key}`);
    const filter = ['category:post', authorsFacet.concat(tagsFacet)];
    const result = await searchIndex.search(``, {
      facetFilters: filter as any, // lib typings need to be fixed
      length: length,
      offset: offset,
      typoTolerance: false,
      distinct: true,
      attributesToRetrieve: ['objectID'],
    });
    const nextIndex = result?.hits?.length ? result.hits.length + offset : null;

    return { results: result.hits, nextIndex: nextIndex, total: result.nbHits };
  }
}

export default PostAPI;
