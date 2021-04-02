import { DataSource } from 'apollo-datasource';
import { getAppDB, sendAuthorNotification } from '../helpers';
import { Client, ThreadID, Where } from '@textile/hub';
import { DataProvider, Comment, PostItem } from '../collections/interfaces';
import { queryCache } from '../storage/cache';
import { searchIndex } from './search-indexes';

class CommentAPI extends DataSource {
  private readonly collection: string;
  private context: any;
  private db: Client;
  private readonly dbID: ThreadID;
  private readonly graphqlCommentsApi = 'awf.graphql.comments.api';
  constructor({ collection, dbID }) {
    super();
    this.collection = collection;
    this.dbID = dbID;
  }

  async initialize(config) {
    this.context = config.context;
    this.db = await getAppDB();
  }

  getCommentCacheKey(commentID: string) {
    return `${this.collection}:commentID${commentID}`;
  }

  getAllCommentsCacheKey(postID: string) {
    return `${this.collection}:comments:postID${postID}`;
  }
  async addComment(
    author: string,
    content: DataProvider[],
    commentData: { postID: string; tags?: string; mentions?: string[]; replyTo?: string },
  ) {
    const db: Client = await getAppDB();
    if (!author) {
      throw new Error('Not authorized');
    }
    const post = await db.findByID<PostItem>(this.dbID, 'Posts', commentData.postID);
    if (!post) {
      throw new Error('This post does not exist.');
    }
    const comment: Comment = {
      _id: '',
      creationDate: new Date().getTime(),
      author: author,
      content: Array.from(content),
      postId: commentData.postID,
      tags: commentData.tags ? Array.from(commentData.tags) : [],
      mentions: commentData.mentions ? Array.from(commentData.mentions) : [],
      replyTo: commentData.replyTo ? commentData.replyTo : '',
      metaData: [
        {
          property: 'version',
          provider: this.graphqlCommentsApi,
          value: '1',
        },
      ],
    };
    const commentID = await db.create(this.dbID, this.collection, [comment]);
    searchIndex.saveObject({
      objectID: commentID[0],
      author: comment.author,
      tags: comment.tags,
      category: 'comment',
      creationDate: comment.creationDate,
      postId: comment.postId,
      content: comment.content.find(e => e.property === 'textContent')?.value,
    });
    await sendAuthorNotification(post.author, {
      property: 'NEW_COMMENT',
      provider: 'awf.graphql.comments.api',
      value: {
        postID: comment.postId,
        author: author,
        commentID: commentID,
      },
    });
    for (const commentMentionedAuthor of comment.mentions) {
      await sendAuthorNotification(commentMentionedAuthor, {
        property: 'COMMENT_MENTION',
        provider: 'awf.graphql.comments.api',
        value: {
          postID: comment.postId,
          author: author,
          commentID: commentID,
        },
      });
    }
    await queryCache.del(this.getAllCommentsCacheKey(commentData.postID));
    return commentID;
  }

  async getComments(postID: string, limit: number, offset: string) {
    const db: Client = await getAppDB();
    let comments;
    const allCommentsCache = this.getAllCommentsCacheKey(postID);
    if (!(await queryCache.has(allCommentsCache))) {
      const query = new Where('postId').eq(postID).orderByDesc('creationDate');
      comments = await db.find<Comment>(this.dbID, this.collection, query);
      await queryCache.set(allCommentsCache, comments);
    }
    comments = await queryCache.get(allCommentsCache);
    const offsetIndex = offset ? comments.findIndex(comment => comment._id === offset) : 0;
    let endIndex = limit + offsetIndex;
    if (comments.length <= endIndex) {
      endIndex = undefined;
    }
    const results = comments.slice(offsetIndex, endIndex);
    const nextIndex = endIndex ? comments[endIndex]._id : null;
    return { results: results, nextIndex: nextIndex, total: comments.length };
  }

  async getComment(commentId: string) {
    const db: Client = await getAppDB();
    let comment;
    const commentCache = this.getCommentCacheKey(commentId);
    if (await queryCache.has(commentCache)) {
      return queryCache.get(commentCache);
    }
    comment = await db.findByID<Comment>(this.dbID, this.collection, commentId);
    if (!comment) {
      return;
    }
    await queryCache.set(commentCache, comment);
    return comment;
  }
}

export default CommentAPI;
