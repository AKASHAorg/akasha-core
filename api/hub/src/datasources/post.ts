import { DataSource } from 'apollo-datasource';
import { getAppDB } from '../helpers';
import { Client, ThreadID } from '@textile/hub';
import { DataProvider, PostItem } from '../collections/interfaces';
import { queryCache } from '../storage/cache';

class PostAPI extends DataSource {
  private readonly collection: string;
  private context: any;
  private readonly dbID: ThreadID;
  private readonly allPostsCache: string;

  constructor({ collection, dbID }) {
    super();
    this.collection = collection;
    this.dbID = dbID;
    this.allPostsCache = `${this.collection}:limit:offset`;
  }

  async initialize(config) {
    this.context = config.context;
  }

  async getPost(id: string) {
    const db: Client = await getAppDB();
    const cacheKey = `${this.collection}:postID${id}`;
    if (queryCache.has(cacheKey)) {
      return Promise.resolve(queryCache.get(cacheKey));
    }
    const post = await db.findByID<PostItem>(this.dbID, this.collection, id);
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
    opt?: { title?: string; tags?: string[]; quotes?: string[]; type?: string },
  ) {
    const db: Client = await getAppDB();
    const post: PostItem = {
      _id: '',
      creationDate: new Date().getTime(),
      author: author,
      type: opt.type || 'DEFAULT',
      content: Array.from(content),
      title: opt.title,
      tags: opt.tags ? Array.from(opt.tags) : [],
      quotes: opt.quotes ? Array.from(opt.quotes) : [],
      metaData: [
        {
          property: 'version',
          provider: 'graphql.posts.api',
          value: '1',
        },
      ],
    };
    queryCache.del(this.allPostsCache);
    return await db.create(this.dbID, this.collection, [post]);
  }
}

export default PostAPI;
