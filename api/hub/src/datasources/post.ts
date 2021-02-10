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
    if (queryCache.has(cacheKey)) {
      return Promise.resolve(queryCache.get(cacheKey));
    }
    const post = await db.findByID<PostItem>(this.dbID, this.collection, id);
    if (!post) {
      return;
    }
    const quotedBy = post?.metaData
      ?.filter(item => item.property === this.quotedByPost)
      ?.map(item => item.value);
    Object.assign(post, { quotedBy });
    if (post?.quotes?.length && !stopIter) {
      post.quotes = await Promise.all(
        post.quotes.map(postID => this.getPost(postID, pubKey, true)),
      );
    }
    queryCache.set(cacheKey, post);
    return post;
  }
  async getPosts(limit: number, offset: string, pubKey?: string) {
    let posts;
    const db: Client = await getAppDB();
    if (queryCache.has(this.allPostsCache)) {
      posts = queryCache.get(this.allPostsCache);
    } else {
      posts = await db.find<PostItem>(this.dbID, this.collection, {
        sort: { desc: true, fieldPath: 'creationDate' },
      });
      for (const post of posts) {
        if (post?.quotes?.length) {
          post.quotes = await Promise.all(post.quotes.map(postID => this.getPost(postID, pubKey)));
        }
        const quotedBy = post?.metaData
          ?.filter(item => item.property === this.quotedByPost)
          ?.map(item => item.value);
        Object.assign(post, { quotedBy });
      }
      queryCache.set(this.allPostsCache, posts);
    }

    const offsetIndex = offset ? posts.findIndex(postItem => postItem._id === offset) : 0;
    let endIndex = limit + offsetIndex;
    if (posts.length <= endIndex) {
      endIndex = undefined;
    }
    const results = posts.slice(offsetIndex, endIndex);
    const nextIndex = endIndex ? posts[endIndex]._id : null;
    return { results: results, nextIndex: nextIndex, total: posts.length };
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
    logger.info('saving a new post:', post);
    queryCache.del(this.allPostsCache);
    const postID = await db.create(this.dbID, this.collection, [post]);
    logger.info('created a new post:', postID[0]);
    await this.addQuotes(post.quotes, postID[0]);
    queryCache.del(this.allPostsCache);
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
      .then(_ => logger.info('indexed post:', postID[0]))
      // tslint:disable-next-line:no-console
      .catch(e => logger.error(e));
    return postID;
  }

  async triggerMentions(mentions: string[], postID, author) {
    const mailSender = await getMailSender();
    const notification = {
      property: 'POST_MENTION',
      provider: 'awf.graphql.posts.api',
      value: {
        postID,
        author,
      },
    };
    const textEncoder = new TextEncoder();
    const encodedNotification = textEncoder.encode(JSON.stringify(notification));
    for (const mention of mentions) {
      logger.info('sending mentions notifications', mention);
      await mailSender.sendMessage(mention, encodedNotification);
    }
  }

  async addQuotes(quotedPosts: string[], postID: string) {
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
        queryCache.del(this.getPostCacheKey(post._id));
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
      attributesToRetrieve: ['objectID', 'category', 'name'],
    });
    const acc = {
      post: [],
      tag: [],
      comment: [],
      profile: [],
    };
    for (const rec of result.hits) {
      const { category, name }: any = rec;
      if (acc.hasOwnProperty(category)) {
        acc[category].push({ id: rec.objectID, name: name });
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
