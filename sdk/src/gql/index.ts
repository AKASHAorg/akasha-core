import { inject, injectable } from 'inversify';
import { TYPES } from '@akashaorg/typings/sdk';
import Stash, { IQuickLRU } from '../stash';
import { GraphQLClient } from 'graphql-request';
import { getSdk, Sdk, SdkFunctionWrapper } from './api';
import Logging from '../logging/index';
import pino from 'pino';

export interface GqlOperation {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
  context?: Record<string, unknown>;
  extensions?: Record<string, unknown>;
}

/** @internal  */
@injectable()
class Gql {
  private _stash: Stash;

  readonly _client: Sdk;
  // #_clientWithCache: Sdk;
  private _log: pino.Logger;
  private _gqlStash: IQuickLRU;

  // create Apollo link object and initialize the stash
  public constructor(@inject(TYPES.Stash) stash: Stash, @inject(TYPES.Log) log: Logging) {
    this._stash = stash;
    const endPoint = new GraphQLClient(process.env.GRAPHQL_URI || '/graphql');
    this._log = log.create('AWF_GQL');
    // create the cache stash for the gql client
    this._stash
      .create({
        maxSize: 1280,
        maxAge: 1000 * 60 * 2,
      })
      .subscribe(x => {
        this._gqlStash = x.data;
      });
    this._client = getSdk(endPoint);
  }

  /**
   * @returns cache container for graphQL results
   */
  getCache(): IQuickLRU {
    return this._gqlStash;
  }

  clearCache() {
    return this._gqlStash.clear();
  }

  /**
   * @param withCache - if the client should cache all the requests
   */
  getAPI(withCache = false) {
    return this._client;
  }
}

export default Gql;
