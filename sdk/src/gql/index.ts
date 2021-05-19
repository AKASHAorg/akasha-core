import { inject, injectable } from 'inversify';
import IGqlClient, { IGqlOperation } from '@akashaproject/sdk-typings/lib/interfaces/gql';
import { ServiceCallResult } from '@akashaproject/sdk-typings/lib/interfaces';
import { ApolloLink, HttpLink, gql, GraphQLRequest } from '@apollo/client';

import hash from 'object-hash';
import { TYPES } from '@akashaproject/sdk-typings';
import { IQuickLRU, Stash } from '../stash';
import { createObservableStream, createObservableValue } from '../helpers/observable';
import { tap } from 'rxjs/operators';

export interface GqlOperation {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
  context?: Record<string, unknown>;
  extensions?: Record<string, unknown>;
}

@injectable()
class Gql implements IGqlClient<unknown> {
  @inject(TYPES.Stash) private _stash: Stash;

  readonly _link: HttpLink;
  private _gqlStash: IQuickLRU;

  // create Apollo link object and initialize the stash
  public constructor() {
    this._link = new HttpLink({ uri: process.env.GRAPHQL_URI || '/graphql' });
    // create the cache stash for the gql client
    this._stash
      .create({
        maxSize: 1280,
        maxAge: 1000 * 30,
      })
      .subscribe(x => (this._gqlStash = x.data));
  }

  /**
   *
   * @param operation - graphQL request object
   * @param saveCache - Cache the result
   * @returns ServiceCallResult<Record<string, T>>
   */
  run<T>(operation: IGqlOperation, saveCache = false): ServiceCallResult<T> {
    const opHash = hash(operation, { algorithm: 'sha1', unorderedObjects: false });
    if (this._gqlStash.has(opHash)) {
      return createObservableValue<T>(this._gqlStash.get(opHash));
    }
    const tOperation = this.makeOperation(operation);
    const obs = createObservableStream<T>(ApolloLink.execute(this._link, tOperation));
    if (saveCache) {
      obs.pipe(tap({ next: value => this._gqlStash.set(opHash, value) }));
    }

    return obs;
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
}

export { Gql };
