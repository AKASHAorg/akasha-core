import { DataSource } from 'apollo-datasource';
import { getAppDB, getMailSender } from '../helpers';
import { Client, ThreadID, Users } from '@textile/hub';
import { DataProvider, PostItem } from '../collections/interfaces';
import { queryCache } from '../storage/cache';

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

  async getPost(id: string, stopIter = false) {
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
      post.quotes = await Promise.all(post.quotes.map(postID => this.getPost(postID, true)));
    }
    queryCache.set(cacheKey, post);
    return post;
  }
  async getPosts(limit: number, offset: string) {
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
          post.quotes = await Promise.all(post.quotes.map(postID => this.getPost(postID)));
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
    queryCache.del(this.allPostsCache);
    const postID = await db.create(this.dbID, this.collection, [post]);
    await this.addQuotes(post.quotes, postID[0]);
    queryCache.del(this.allPostsCache);
    if (post.mentions && post.mentions.length) {
      await this.triggerMentions(post.mentions, postID, post.author);
    }
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
}

export default PostAPI;
