import { Buffer } from 'buffer';
import { inject, injectable } from 'inversify';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import Gql from '../gql';
import AWF_Auth from '../auth';
import { TYPES } from '@akashaproject/sdk-typings';
import Logging from '../logging';
import {
  AddComment,
  GetComment,
  GetComments,
  EditComment,
  RemoveComment,
} from './comments.graphql';
import { DataProviderInput } from '@akashaproject/sdk-typings/lib/interfaces/common';
import { concatAll, map, tap } from 'rxjs/operators';
import { AWF_IComments } from '@akashaproject/sdk-typings/lib/interfaces/posts';
import { COMMENTS_EVENTS } from '@akashaproject/sdk-typings/lib/interfaces/events';
import EventBus from '../common/event-bus';
import {
  Comment_Response,
  Comments_Response,
} from '@akashaproject/sdk-typings/lib/interfaces/responses';

@injectable()
class AWF_Comments implements AWF_IComments {
  private _log: ILogger;
  private _gql: Gql;
  private _auth: AWF_Auth;
  private _globalChannel: EventBus;
  public readonly graphQLDocs = {
    GetComment,
    GetComments,
    AddComment,
    RemoveComment,
    EditComment,
  };

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
   *
   * @param commentID
   */
  getComment(commentID: string) {
    return this._gql.run<{ getComment: Comment_Response }>(
      {
        query: GetComment,
        variables: { commentID: commentID },
        operationName: 'GetComment',
      },
      true,
    );
  }

  /**
   *
   * @param opt
   */
  getComments(opt: { offset?: string; limit: number; postID: string }) {
    return this._gql.run<{ getComments: Comments_Response }>(
      {
        query: GetComments,
        variables: { offset: opt.offset, limit: opt.limit, postID: opt.postID },
        operationName: 'GetComments',
      },
      true,
    );
  }

  /**
   *
   * @param opt
   */
  addComment(opt: {
    data: DataProviderInput[];
    comment: { postID: string; replyTo?: string; tags?: string[]; mentions?: string[] };
  }) {
    const textContent = opt.data.find(e => e.property === 'textContent');
    textContent.value = Buffer.from(textContent.value).toString('base64');
    this._gql.clearCache();
    return this._auth
      .authenticateMutationData(opt.data as unknown as Record<string, unknown>[])
      .pipe(
        map(res => {
          return this._gql
            .run<{ addComment: string }>(
              {
                query: AddComment,
                variables: { content: opt.data, comment: opt.comment },
                operationName: 'AddComment',
                context: {
                  headers: {
                    Authorization: `Bearer ${res.token.data}`,
                    Signature: res.signedData.data.signature,
                  },
                },
              },
              false,
            )
            .pipe(
              tap(ev => {
                // @emits COMMENTS_EVENTS.CREATE
                this._globalChannel.next({
                  data: ev.data,
                  event: COMMENTS_EVENTS.CREATE,
                  args: opt,
                });
              }),
            );
        }),
        concatAll(),
      );
  }

  /**
   * Update an existing comment
   * @param opt
   */
  editComment(opt: {
    commentID: string;
    data: DataProviderInput[];
    comment: { postID: string; replyTo?: string; tags?: string[]; mentions?: string[] };
  }) {
    const textContent = opt.data.find(e => e.property === 'textContent');
    textContent.value = Buffer.from(textContent.value).toString('base64');
    this._gql.clearCache();
    return this._auth
      .authenticateMutationData(opt.data as unknown as Record<string, unknown>[])
      .pipe(
        map(res => {
          return this._gql
            .run<{ editComment: boolean }>({
              query: EditComment,
              variables: { content: opt.data, comment: opt.comment, id: opt.commentID },
              operationName: 'EditComment',
              context: {
                headers: {
                  Authorization: `Bearer ${res.token.data}`,
                  Signature: res.signedData.data.signature,
                },
              },
            })
            .pipe(
              tap(ev => {
                // @emits COMMENTS_EVENTS.EDIT
                this._globalChannel.next({
                  data: ev.data,
                  event: COMMENTS_EVENTS.EDIT,
                  args: opt,
                });
              }),
            );
        }),
        concatAll(),
      );
  }

  /**
   * Remove a comment's data by ID
   * @param commentID
   */
  removeComment(commentID: string) {
    return this._auth.authenticateMutationData(commentID).pipe(
      map(res => {
        return this._gql
          .run<{ removeComment: boolean }>(
            {
              query: RemoveComment,
              variables: { id: commentID },
              operationName: 'RemoveComment',
              context: {
                headers: {
                  Authorization: `Bearer ${res.token.data}`,
                  Signature: res.signedData.data.signature,
                },
              },
            },
            false,
          )
          .pipe(
            tap(ev => {
              // @emits COMMENTS_EVENTS.REMOVE
              this._globalChannel.next({
                data: ev.data,
                event: COMMENTS_EVENTS.REMOVE,
                args: { commentID },
              });
            }),
          );
      }),
      concatAll(),
    );
  }
}

export default AWF_Comments;
