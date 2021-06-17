import { inject, injectable } from 'inversify';
import { TYPES } from '@akashaproject/sdk-typings';
import Web3Connector from '../common/web3.connector';
import Logging from '../logging';
import Gql from '../gql';
import { ILogger } from '@akashaproject/sdk-typings/src/interfaces/log';
import { CreateTag, GetTag, GetTags, SearchTags } from './tag.graphql';
import AWF_Auth from '../auth';
import { concatAll, map, tap } from 'rxjs/operators';
import { AWF_ITags } from '@akashaproject/sdk-typings/src/interfaces/posts';
import { TAG_EVENTS } from '@akashaproject/sdk-typings/src/interfaces/events';
import EventBus from '../common/event-bus';

@injectable()
export default class AWF_Tags implements AWF_ITags {
  private readonly _web3: Web3Connector;
  private _log: ILogger;
  private _gql: Gql;
  private _auth: AWF_Auth;
  private _globalChannel: EventBus;
  public readonly graphQLDocs = { GetTag, GetTags, SearchTags, CreateTag };
  constructor(
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Gql) gql: Gql,
    @inject(TYPES.Auth) auth: AWF_Auth,
    @inject(TYPES.EventBus) globalChannel: EventBus,
  ) {
    this._log = log.create('AWF_Tags');
    this._gql = gql;
    this._auth = auth;
    this._globalChannel = globalChannel;
  }

  /**
   *
   * @param tagName
   */
  getTag(tagName: string) {
    return this._gql.run<{ name: string }>(
      {
        query: GetTag,
        variables: { name: tagName },
        operationName: 'GetTag',
      },
      true,
    );
  }

  /**
   *
   * @param opt
   */
  getTags(opt: { offset?: string; limit: number }) {
    return this._gql.run(
      {
        query: GetTags,
        variables: { offset: opt.offset || '', limit: opt.limit || 5 },
        operationName: 'GetTags',
      },
      true,
    );
  }

  /**
   *
   * @param name
   */
  searchTags(name: string) {
    return this._gql.run({
      query: SearchTags,
      variables: { name: name },
      operationName: 'SearchTags',
    });
  }

  /**
   *
   * @param tagName
   */
  createTag(tagName: string) {
    return this._auth.authenticateMutationData(tagName).pipe(
      map(res => {
        return this._gql
          .run({
            query: CreateTag,
            variables: { name: tagName },
            operationName: 'CreateTag',
            context: {
              headers: {
                Authorization: `Bearer ${res.token}`,
                Signature: res.signedData.data.signature,
              },
            },
          })
          .pipe(
            tap(ev => {
              // @emits TAG_EVENTS.CREATE
              this._globalChannel.next({
                data: ev.data,
                event: TAG_EVENTS.CREATE,
                args: { tagName },
              });
            }),
          );
      }),
      concatAll(),
    );
  }

  /**
   * Returns most recent used tags
   */
  getTrending() {
    return this.searchTags('');
  }
}
