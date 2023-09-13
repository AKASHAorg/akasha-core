import { Buffer } from 'buffer';
import { inject, injectable } from 'inversify';
import {
  CommentID,
  CommentIDSchema,
  COMMENTS_EVENTS,
  DataProviderInputSchema,
  EntryID,
  EntryIDSchema,
  TYPES,
} from '@akashaorg/typings/lib/sdk';
import { DataProviderInput } from '@akashaorg/typings/lib/sdk/graphql-types';
import Gql from '../gql';
import AWF_Auth from '../auth';
import Logging from '../logging';
import EventBus from '../common/event-bus';
import pino from 'pino';
import { throwError } from '../common/error-handling';
import { validate } from '../common/validator';
import { z } from 'zod';

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
  //
  // /**
  //  * Get comment data
  //  */
  // @validate(CommentIDSchema)
  // async getComment(commentID: CommentID) {
  //   return this._gql.getAPI().GetComment({ commentID: commentID });
  // }
  //
  // /**
  //  * Get a list of comments for a post
  //  */
  // @validate(z.object({ offset: CommentIDSchema, limit: z.number(), postID: EntryIDSchema }))
  // async getComments(opt: { offset?: CommentID; limit: number; postID: EntryID }) {
  //   return this._gql
  //     .getAPI()
  //     .GetComments({ offset: opt.offset, limit: opt.limit, postID: opt.postID });
  // }
  //
  // /**
  //  * Get a list of replies for a comment
  //  */
  // @validate(
  //   z.object({
  //     offset: CommentIDSchema,
  //     limit: z.number(),
  //     postID: EntryIDSchema,
  //     commentID: CommentIDSchema,
  //   }),
  // )
  // async getReplies(opt: {
  //   offset?: CommentID;
  //   limit: number;
  //   postID: EntryID;
  //   commentID: CommentID;
  // }) {
  //   return this._gql.getAPI().GetReplies({
  //     offset: opt.offset,
  //     limit: opt.limit,
  //     postID: opt.postID,
  //     commentID: opt.commentID,
  //   });
  // }
  //
  // /**
  //  * Create a new comment
  //  */
  // @validate(
  //   z.object({
  //     data: z.array(DataProviderInputSchema),
  //     comment: z.object({
  //       postID: EntryIDSchema,
  //       replyTo: CommentIDSchema.optional(),
  //       tags: z.array(z.string()).optional(),
  //       mentions: z.array(z.string()).optional(),
  //     }),
  //   }),
  // )
  // async addComment(opt: {
  //   data: DataProviderInput[];
  //   comment: { postID: EntryID; replyTo?: CommentID; tags?: string[]; mentions?: string[] };
  // }) {
  //   const textContent = opt.data.find(e => e.property === 'textContent');
  //   if (!textContent) {
  //     throwError('Comment does not have content', ['sdk', 'comments', 'addComment']);
  //     return;
  //   }
  //   textContent.value = Buffer.from(textContent.value).toString('base64');
  //   const auth = await this._auth.authenticateMutationData(
  //     opt.data as unknown as Record<string, unknown>[],
  //   );
  //   const newComm = await this._gql.getAPI().AddComment(
  //     { content: opt.data, comment: opt.comment },
  //     {
  //       Authorization: `Bearer ${auth.token}`,
  //       Signature: auth.signedData.signature.toString(),
  //     },
  //   );
  //   this._globalChannel.next({
  //     data: newComm.addComment,
  //     event: COMMENTS_EVENTS.CREATE,
  //     args: opt,
  //   });
  //
  //   return newComm;
  // }
  //
  // /**
  //  * Update an existing comment
  //  */
  // @validate(
  //   z.object({
  //     commentID: CommentIDSchema,
  //     data: z.array(DataProviderInputSchema),
  //     comment: z.object({
  //       postID: EntryIDSchema,
  //       replyTo: CommentIDSchema.optional(),
  //       tags: z.array(z.string()).optional(),
  //       mentions: z.array(z.string()).optional(),
  //     }),
  //   }),
  // )
  // async editComment(opt: {
  //   commentID: string;
  //   data: DataProviderInput[];
  //   comment: { postID: EntryID; replyTo?: CommentID; tags?: string[]; mentions?: string[] };
  // }) {
  //   const textContent = opt.data.find(e => e.property === 'textContent');
  //   if (!textContent) {
  //     throwError('Cannot edit comment with no content', ['sdk', 'comments', 'editComment']);
  //     return;
  //   }
  //   textContent.value = Buffer.from(textContent.value).toString('base64');
  //   const auth = await this._auth.authenticateMutationData(
  //     opt.data as unknown as Record<string, unknown>[],
  //   );
  //   const comm = await this._gql.getAPI().EditComment(
  //     { content: opt.data, comment: opt.comment, id: opt.commentID },
  //     {
  //       Authorization: `Bearer ${auth.token}`,
  //       Signature: auth.signedData.signature.toString(),
  //     },
  //   );
  //   // @emits COMMENTS_EVENTS.EDIT
  //   this._globalChannel.next({
  //     data: comm.editComment,
  //     event: COMMENTS_EVENTS.EDIT,
  //     args: opt,
  //   });
  //   return comm;
  // }
  //
  // /**
  //  * Remove a comment's data by ID
  //  */
  // @validate(CommentIDSchema)
  // async removeComment(commentID: CommentID) {
  //   const auth = await this._auth.authenticateMutationData(commentID);
  //   const res = await this._gql.getAPI().RemoveComment(
  //     { id: commentID },
  //     {
  //       Authorization: `Bearer ${auth.token}`,
  //       Signature: auth.signedData.signature.toString(),
  //     },
  //   );
  //   // @emits COMMENTS_EVENTS.REMOVE
  //   this._globalChannel.next({
  //     data: res.removeComment,
  //     event: COMMENTS_EVENTS.REMOVE,
  //     args: { commentID },
  //   });
  //   return res;
  // }
}

export default AWF_Comments;
