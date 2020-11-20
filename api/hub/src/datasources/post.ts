import { DataSource } from 'apollo-datasource';
import { getAppDB } from '../helpers';
import { Client, ThreadID } from '@textile/hub';
import { DataProvider, PostItem } from '../collections/interfaces';
import { queryCache } from '../storage/cache';

class PostAPI extends DataSource {
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

  async getPost(id: string) {
    const db: Client = await getAppDB();
    return await db.findByID<PostItem>(this.dbID, this.collection, id);
  }
  async getPosts(limit: number, offset: string) {
    let posts;
    const db: Client = await getAppDB();
    if (queryCache.has(this.collection)) {
      posts = queryCache.get(this.collection);
    } else {
      posts = await db.find<PostItem>(this.dbID, this.collection, {
        sort: { desc: true, fieldPath: 'creationDate' },
      });
      queryCache.set(this.collection, posts);
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
    opt?: { title?: string; tags?: string[]; type?: string },
  ) {
    const db: Client = await getAppDB();
    const post: PostItem = {
      _id: '',
      creationDate: new Date().getTime(),
      author: author,
      type: opt.type || 'DEFAULT',
      content: Array.from(content),
      title: opt.title,
      tags: Array.from(opt.tags),
      metaData: [
        {
          property: 'version',
          provider: 'graphql.posts.api',
          value: '1',
        },
      ],
    };
    return await db.create(this.dbID, this.collection, [post]);
  }
}

export default PostAPI;
