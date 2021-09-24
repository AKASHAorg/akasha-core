import { inject, injectable } from 'inversify';
import IGqlClient from '@akashaproject/sdk-typings/lib/interfaces/gql';
import { ServiceCallResult } from '@akashaproject/sdk-typings/lib/interfaces';
import { gql, GraphQLRequest, HttpLink } from '@apollo/client';

import hash from 'object-hash';
import { TYPES } from '@akashaproject/sdk-typings';
import Stash, { IQuickLRU } from '../stash';
import { createObservableStreamGql, createObservableValue } from '../helpers/observable';

export interface GqlOperation {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
  context?: Record<string, unknown>;
  extensions?: Record<string, unknown>;
}

@injectable()
class Gql implements IGqlClient<unknown> {
  private _stash: Stash;

  readonly _link: HttpLink;
  private _gqlStash: IQuickLRU;

  // create Apollo link object and initialize the stash
  public constructor(@inject(TYPES.Stash) stash: Stash) {
    this._stash = stash;
    this._link = new HttpLink({ uri: process.env.GRAPHQL_URI || '/graphql' });
    // create the cache stash for the gql client
    this._stash
      .create({
        maxSize: 1280,
        maxAge: 1000 * 60 * 2,
      })
      .subscribe(x => (this._gqlStash = x.data));
  }

  /**
   *
   * @param operation - graphQL request object
   * @param saveCache - Cache the result
   * @returns ServiceCallResult<Record<string, T>>
   */
  run<T>(operation: GraphQLRequest, saveCache = false): ServiceCallResult<T> {
    const opHash = this._stash.computeKey(operation);
    if (this._gqlStash.has(opHash)) {
      return createObservableValue<T>(this._gqlStash.get(opHash));
    }
    return createObservableStreamGql<T>(
      this._link,
      operation,
      saveCache &&
        (value => {
          this._gqlStash.set(opHash, value);
        }),
    );
  }

  /**
   *
   * @param operation - graphQL request object
   * @returns an object with the transformed graphQL template string for query
   */
  makeOperation(operation: GqlOperation): GraphQLRequest {
    const { query, ...other } = operation;
    return {
      query: gql`
        ${query}
      `,
      ...other,
    };
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
}

export default Gql;
