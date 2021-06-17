import { Buffer } from 'buffer';
import { inject, injectable } from 'inversify';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import Gql from '../gql';
import AWF_Auth from '../auth';
import { TYPES } from '@akashaproject/sdk-typings';
import Logging from '../logging';
import { AddComment, GetComment, GetComments } from './comments.graphql';
import { DataProviderInput } from '@akashaproject/sdk-typings/lib/interfaces/common';
import { concatAll, map, tap } from 'rxjs/operators';
import { AWF_IComments } from '@akashaproject/sdk-typings/lib/interfaces/posts';
import { COMMENTS_EVENTS } from '@akashaproject/sdk-typings/lib/interfaces/events';
import EventBus from '../common/event-bus';

@injectable()
export default class AWF_Comments implements AWF_IComments {
  private _log: ILogger;
  private _gql: Gql;
  private _auth: AWF_Auth;
  private _globalChannel: EventBus;
  public readonly graphQLDocs = {
    GetComment,
    GetComments,
    AddComment,
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
    return this._gql.run(
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
    return this._gql.run(
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
      .authenticateMutationData((opt.data as unknown) as Record<string, unknown>[])
      .pipe(
        map(res => {
          return this._gql
            .run({
              query: AddComment,
              variables: { content: opt.data, comment: opt.comment },
              operationName: 'AddComment',
              context: {
                headers: {
                  Authorization: `Bearer ${res.token}`,
                  Signature: res.signedData.data.signature,
                },
              },
            })
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
}
