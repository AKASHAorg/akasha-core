import { Buffer } from 'buffer';
import { inject, injectable } from 'inversify';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import Gql from '../gql';
import AWF_Auth from '../auth';
import { TYPES } from '@akashaproject/sdk-typings';
import Logging from '../logging';
import {
  CreateEntry,
  GetEntries,
  GetEntry,
  GetPostsByAuthor,
  GetPostsByTag,
} from './entry.graphql';
import { concatAll, map, tap } from 'rxjs/operators';
import { DataProviderInput } from '@akashaproject/sdk-typings/lib/interfaces/common';
import { AWF_IEntry } from '@akashaproject/sdk-typings/lib/interfaces/posts';
import { COMMENTS_EVENTS, ENTRY_EVENTS } from '@akashaproject/sdk-typings/lib/interfaces/events';
import EventBus from '../common/event-bus';

@injectable()
export default class AWF_Entry implements AWF_IEntry {
  private _log: ILogger;
  private _gql: Gql;
  private _auth: AWF_Auth;
  private _globalChannel: EventBus;
  public readonly graphQLDocs = {
    CreateEntry,
    GetEntries,
    GetEntry,
    GetPostsByAuthor,
    GetPostsByTag,
  };
  constructor(
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Gql) gql: Gql,
    @inject(TYPES.Auth) auth: AWF_Auth,
    @inject(TYPES.EventBus) globalChannel: EventBus,
  ) {
    this._log = log.create('AWF_Entry');
    this._gql = gql;
    this._auth = auth;
    this._globalChannel = globalChannel;
  }

  /**
   *
   * @param entryId
   */
  getEntry(entryId: string) {
    return this._auth.getCurrentUser().pipe(
      map(result =>
        this._gql.run(
          {
            query: GetEntry,
            variables: { id: entryId, pubKey: result?.data.pubKey },
            operationName: 'GetEntry',
          },
          true,
        ),
      ),
      concatAll(),
    );
  }

  /**
   *
   * @param opt
   */
  getEntries(opt: { offset?: string; limit: number }) {
    return this._auth.getCurrentUser().pipe(
      map(result =>
        this._gql.run(
          {
            query: GetEntries,
            variables: { offset: opt.offset, limit: opt.limit, pubKey: result?.data.pubKey },
            operationName: 'GetEntries',
          },
          true,
        ),
      ),
      concatAll(),
    );
  }

  /**
   *
   * @param opt
   */
  postEntry(opt: {
    data: DataProviderInput[];
    post: { title?: string; tags?: string[]; quotes?: string[] };
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
              query: CreateEntry,
              variables: { content: opt.data, post: opt.post },
              operationName: 'CreateEntry',
              context: {
                headers: {
                  Authorization: `Bearer ${res.token}`,
                  Signature: res.signedData.data.signature,
                },
              },
            })
            .pipe(
              tap(ev => {
                // @emits ENTRY_EVENTS.CREATE
                this._globalChannel.next({
                  data: ev.data,
                  event: ENTRY_EVENTS.CREATE,
                  args: opt,
                });
              }),
            );
        }),
        concatAll(),
      );
  }

  entriesByAuthor(opt: { pubKey: string; offset?: number; limit: number }) {
    return this._auth.getCurrentUser().pipe(
      map(result =>
        this._gql.run(
          {
            query: GetPostsByAuthor,
            variables: {
              author: opt.pubKey,
              offset: opt.offset,
              limit: opt.limit,
              pubKey: result?.data.pubKey,
            },
            operationName: 'GetPostsByAuthor',
          },
          true,
        ),
      ),
      concatAll(),
    );
  }

  /**
   *
   * @param opt
   */
  entriesByTag(opt: { name: string; offset?: string; limit: number }) {
    return this._auth.getCurrentUser().pipe(
      map(result =>
        this._gql.run(
          {
            query: GetPostsByTag,
            variables: {
              tag: opt.name,
              offset: opt.offset,
              limit: opt.limit,
              pubKey: result?.data.pubKey,
            },
            operationName: 'GetPostsByTag',
          },
          true,
        ),
      ),
      concatAll(),
    );
  }
}
