import { inject, injectable } from 'inversify';
import { TYPES } from '@akashaorg/typings/sdk';
import Stash, { IQuickLRU } from '../stash';
import { getSdk, Requester, Sdk } from './api.new';
import Logging from '../logging/index';
import pino from 'pino';
import CeramicService from '../common/ceramic';
import type { DocumentNode } from 'graphql';

/** @internal  */
@injectable()
class Gql {
  private _stash: Stash;

  readonly _client: Sdk;
  readonly _ceramic: CeramicService;
  // #_clientWithCache: Sdk;
  private _log: pino.Logger;
  private _gqlStash: IQuickLRU;

  // create Apollo link object and initialize the stash
  public constructor(
    @inject(TYPES.Stash) stash: Stash,
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Ceramic) ceramic: CeramicService,
  ) {
    this._stash = stash;
    this._log = log.create('AWF_GQL');
    // create the cache stash for the gql client
    this._gqlStash = this._stash.create({
      maxSize: 1280,
      maxAge: 1000 * 60 * 2,
    }).data;
    this._ceramic = ceramic;
    const requester = async <R, V>(doc: DocumentNode, vars: V): Promise<R> => {
      const result = await this._ceramic
        .getComposeClient()
        .execute(doc, vars as Record<string, unknown> | undefined);
      if (!result.errors || !result.errors.length) {
        return result.data as R;
      }
      throw result.errors;
    };

    this._client = getSdk(requester);
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
   * remove 'any' from return after all the graphql fragments are updated
   */
  getAPI(withCache = false) {
    return this._client;
  }
}

export default Gql;
