import { Buffer } from 'buffer';
import { inject, injectable } from 'inversify';
import { COMMENTS_EVENTS, DataProviderInput, TYPES } from '@akashaorg/typings/sdk';
import Gql from '../gql';
import AWF_Auth from '../auth';
import Logging from '../logging';
import EventBus from '../common/event-bus';
import pino from 'pino';

/**
 * # sdk.api.comments
 *
 * Comments Module
 */
@injectable()
class AWF_Comments {
  private _log: pino.Logger;
  private _gql: Gql;
  private _auth: AWF_Auth;
  private _globalChannel: EventBus;

  constructor(
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Gql) gql: Gql,
    @inject(TYPES.Auth) auth: AWF_Auth,
    @inject(TYPES.EventBus) globalChannel: EventBus,
  ) {
    this._log = log.create('AWF_Comments');
    this._gql = gql;
    this._auth = auth;
    this._globalChannel = globalChannel;
  }

  /**
   * Get comment data
   */
  async getComment(commentID: string) {
    return this._gql.getAPI().GetComment({ commentID: commentID });
  }

  /**
   * Get a list of comments for a post
   */
  async getComments(opt: { offset?: string; limit: number; postID: string }) {
    return this._gql
      .getAPI()
      .GetComments({ offset: opt.offset, limit: opt.limit, postID: opt.postID });
  }

  /**
   * Get a list of replies for a comment
   */
  async getReplies(opt: { offset?: string; limit: number; postID: string; commentID: string }) {
    return this._gql.getAPI().GetReplies({
      offset: opt.offset,
      limit: opt.limit,
      postID: opt.postID,
      commentID: opt.commentID,
    });
  }

  /**
   * Create a new comment
   */
  async addComment(opt: {
    data: DataProviderInput[];
    comment: { postID: string; replyTo?: string; tags?: string[]; mentions?: string[] };
  }) {
    const textContent = opt.data.find(e => e.property === 'textContent');
    textContent.value = Buffer.from(textContent.value).toString('base64');
    const auth = await this._auth.authenticateMutationData(
      opt.data as unknown as Record<string, unknown>[],
    );
    const newComm = await this._gql.getAPI().AddComment(
      { content: opt.data, comment: opt.comment },
      {
        Authorization: `Bearer ${auth.token}`,
        Signature: auth.signedData.signature.toString(),
      },
    );
    this._globalChannel.next({
      data: newComm.addComment,
      event: COMMENTS_EVENTS.CREATE,
      args: opt,
    });

    return newComm;
  }

  /**
   * Update an existing comment
   */
  async editComment(opt: {
    commentID: string;
    data: DataProviderInput[];
    comment: { postID: string; replyTo?: string; tags?: string[]; mentions?: string[] };
  }) {
    const textContent = opt.data.find(e => e.property === 'textContent');
    textContent.value = Buffer.from(textContent.value).toString('base64');
    const auth = await this._auth.authenticateMutationData(
      opt.data as unknown as Record<string, unknown>[],
    );
    const comm = await this._gql.getAPI().EditComment(
      { content: opt.data, comment: opt.comment, id: opt.commentID },
      {
        Authorization: `Bearer ${auth.token}`,
        Signature: auth.signedData.signature.toString(),
      },
    );
    // @emits COMMENTS_EVENTS.EDIT
    this._globalChannel.next({
      data: comm.editComment,
      event: COMMENTS_EVENTS.EDIT,
      args: opt,
    });
    return comm;
  }

  /**
   * Remove a comment's data by ID
   */
  async removeComment(commentID: string) {
    const auth = await this._auth.authenticateMutationData(commentID);
    const res = await this._gql.getAPI().RemoveComment(
      { id: commentID },
      {
        Authorization: `Bearer ${auth.token}`,
        Signature: auth.signedData.signature.toString(),
      },
    );
    // @emits COMMENTS_EVENTS.REMOVE
    this._globalChannel.next({
      data: res.removeComment,
      event: COMMENTS_EVENTS.REMOVE,
      args: { commentID },
    });
    return res;
  }
}

export default AWF_Comments;
