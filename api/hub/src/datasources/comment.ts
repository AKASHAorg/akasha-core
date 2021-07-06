import { DataSource } from 'apollo-datasource';
import { EMPTY_KEY, getAppDB, logger, sendAuthorNotification } from '../helpers';
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
    const textContent = comment.content.find(e => e.property === 'textContent');
    if (Buffer.from(textContent.value, 'base64').toString('base64') !== textContent.value) {
      textContent.value = Buffer.from(textContent.value).toString('base64');
    }
    const commentID = await db.create(this.dbID, this.collection, [comment]);
    searchIndex.saveObject({
      objectID: commentID[0],
      author: comment.author,
      tags: comment.tags,
      category: 'comment',
      creationDate: comment.creationDate,
      postId: comment.postId,
      content: textContent ? Buffer.from(textContent?.value, 'base64').toString() : '',
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

    const commentCache = this.getCommentCacheKey(commentId);
    if (await queryCache.has(commentCache)) {
      return queryCache.get(commentCache);
    }
    const comment = await db.findByID<Comment>(this.dbID, this.collection, commentId);
    if (!comment) {
      logger.warn(`comment ${commentId} not found`);
      throw new Error(`Comment not found`);
    }
    await queryCache.set(commentCache, comment);
    return comment;
  }

  /**
   * Update an existing comment
   * @param author
   * @param id
   * @param content
   * @param commentData
   */
  async editComment(
    author: string,
    id: string,
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

    const currentComment = await db.findByID<Comment>(this.dbID, this.collection, id);
    if (!currentComment?._id) {
      return Promise.reject(`Comment with [id] ${id} was not found!`);
    }

    if (currentComment.postId !== commentData.postID) {
      return Promise.reject('Post [id] mismatch!');
    }

    if (currentComment.author !== author) {
      throw new Error('Not authorized');
    }

    currentComment.metaData = currentComment.metaData.concat(currentComment.content);
    currentComment.content = Array.from(content);
    let removedTags = [];
    let addedTags = [];
    if (commentData.tags) {
      const newTags = Array.from(commentData.tags);
      removedTags = currentComment.tags.filter(t => !newTags.includes(t));
      addedTags = newTags.filter(t => !currentComment.tags.includes(t));
      currentComment.tags = newTags;
    }

    currentComment.mentions = commentData.mentions
      ? Array.from(commentData.mentions)
      : commentData.mentions;
    currentComment.updatedAt = new Date().getTime();
    const textContent = currentComment.content.find(e => e.property === 'textContent');
    if (Buffer.from(textContent.value, 'base64').toString('base64') !== textContent.value) {
      textContent.value = Buffer.from(textContent.value).toString('base64');
    }

    searchIndex
      .saveObject({
        objectID: id,
        author: currentComment.author,
        tags: currentComment.tags,
        category: 'comment',
        creationDate: currentComment.creationDate,
        postId: currentComment.postId,
        content: textContent ? Buffer.from(textContent?.value, 'base64').toString() : '',
      })
      .then(() => logger.info(`index edited comment: ${id}`))
      // tslint:disable-next-line:no-console
      .catch(e => logger.error(e));
    await db.save(this.dbID, this.collection, [currentComment]);
    await queryCache.del(this.getCommentCacheKey(id));
    await queryCache.del(this.getAllCommentsCacheKey(commentData.postID));
    return { removedTags, addedTags };
  }

  /**
   * Remove contents of a comment
   * @param author
   * @param id
   */
  async deleteComment(author: string, id: string) {
    const db: Client = await getAppDB();
    if (!author) {
      throw new Error('Not authorized');
    }
    const currentComment = await db.findByID<Comment>(this.dbID, this.collection, id);
    if (!currentComment?._id) {
      return Promise.reject(`Comment with [id] ${id} was not found!`);
    }
    currentComment.content = [
      {
        property: 'removed',
        provider: this.graphqlCommentsApi,
        value: '1',
      },
    ];
    currentComment.updatedAt = new Date().getTime();
    currentComment.metaData = [];
    const removedTags = Array.from(currentComment.tags);
    currentComment.mentions = [];
    currentComment.author = EMPTY_KEY;
    searchIndex
      .deleteObject(currentComment._id)
      .then(() => logger.info(`removed comment: ${id}`))
      .catch(e => logger.error(e));
    await queryCache.del(this.getCommentCacheKey(id));
    await queryCache.del(this.getAllCommentsCacheKey(currentComment.postId));
    await db.save(this.dbID, this.collection, [currentComment]);
    return { removedTags };
  }
}

export default CommentAPI;
