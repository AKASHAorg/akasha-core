import { inject, injectable } from 'inversify';
import { GQL_EVENTS, TYPES } from '@akashaorg/typings/lib/sdk';
import Stash, { IQuickLRU } from '../stash';
import { getSdk, Sdk } from './api';
import Logging from '../logging/index';
import pino from 'pino';
import CeramicService from '../common/ceramic';
import type { DocumentNode } from 'graphql';
import EventBus from '../common/event-bus';
import { validate } from '../common/validator';
import { z } from 'zod';
import { ExecutionResult } from 'graphql/index';
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, Observable, split } from '@apollo/client';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { sha256 } from 'crypto-hash';

const enum ContextSources{
  DEFAULT = 1,
  COMPOSEDB = 2,
}

/** @internal  */
@injectable()
class Gql {
  private _stash: Stash;

  readonly _client: Sdk;
  readonly _ceramic: CeramicService;
  // #_clientWithCache: Sdk;
  private _log: pino.Logger;
  private _gqlStash: IQuickLRU;
  private _globalChannel: EventBus;
  readonly apolloClient: ApolloClient<unknown>

  // create Apollo link object and initialize the stash
  public constructor (
    @inject(TYPES.Stash) stash: Stash,
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Ceramic) ceramic: CeramicService,
    @inject(TYPES.EventBus) globalChannel: EventBus,
  ) {
    this._stash = stash;
    this._log = log.create('AWF_GQL');
    this._globalChannel = globalChannel;
    // create the cache stash for the gql client
    this._gqlStash = this._stash.create({
      maxSize: 1280,
      maxAge: 1000 * 60 * 2,
    }).data;
    this._ceramic = ceramic;
    const composeDBlink = new ApolloLink((operation) => {
      return new Observable((observer) => {
        this._ceramic.getComposeClient().execute(operation.query, operation.variables).then(
          (result) => {
            observer.next(result);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          },
        );
      });
    });
    const directionalLink = split(
      (operation) => {
        return operation.getContext().source === this.contextSources.composeDB;
      },
      composeDBlink,
      createPersistedQueryLink({ sha256 }).concat(new HttpLink({ uri: process.env.GRAPHQL_URI || 'http://localhost:4112/' })),
    );

    this.apolloClient = new ApolloClient({
      cache: new InMemoryCache(),
      link: directionalLink,
    });
    const requester = async <R, V> (doc: DocumentNode, vars?: V, options?: Record<string, any>): Promise<R> => {
      const result = await this.queryClient({
        query: doc,
        variables: vars as Record<string, unknown> | undefined,
        context: options?.context,
      });

      if (!result.errors || !result.errors.length) {
        return result.data as R;
      }
      throw result.errors;
    };

    this._client = getSdk(requester);
  }

  get queryClient() {
    return this.apolloClient.query;
  }

  get contextSources(){
    return {
      default: ContextSources.DEFAULT,
      composeDB: ContextSources.COMPOSEDB
    }
  }

  async wrapWithMutationEvent (c: Promise<ExecutionResult<Record<string, unknown>>>, m: string) {
    const uuid = crypto.randomUUID();
    sessionStorage.setItem(uuid, m);
    this._globalChannel.next({
      data: { uuid, success: false, pending: true },
      event: GQL_EVENTS.MUTATION,
    });

    const result = await c;
    if (!result.errors || !result.errors.length) {
      this._globalChannel.next({
        data: { uuid, success: true, pending: false },
        event: GQL_EVENTS.MUTATION,
      });
    } else {
      sessionStorage.setItem(uuid, JSON.stringify({ errors: result.errors, successInfo: m }));
      this._globalChannel.next({
        data: { uuid, success: false, errors: result.errors, pending: false },
        event: GQL_EVENTS.MUTATION,
      });
    }
    return result;
  }

  /**
   * @returns cache container for graphQL results
   */
  getCache (): IQuickLRU {
    return this._gqlStash;
  }

  get mutationNotificationConfig () {
    return Object.freeze({
      optionName: 'EmitNotification',
    });
  }

  @validate(z.string().min(20))
  consumeMutationNotificationObject (uuid: string) {
    const notification = sessionStorage.getItem(uuid);
    sessionStorage.removeItem(uuid);
    if (!notification) {
      return;
    }
    try {
      return JSON.parse(notification);
    } catch (e) {
      this._log.warn(e);
      return;
    }
  }

  clearCache () {
    return this._gqlStash.clear();
  }

  /**
   * @param withCache - if the client should cache all the requests
   * remove 'any' from return after all the graphql fragments are updated
   */
  getAPI (withCache = false) {
    return this._client;
  }
}

export default Gql;
