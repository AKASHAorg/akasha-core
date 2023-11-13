import { inject, injectable } from 'inversify';
import { GQL_EVENTS, TYPES } from '@akashaorg/typings/lib/sdk';
import { getSdk, Sdk } from './api';
import Logging from '../logging/index';
import pino from 'pino';
import CeramicService from '../common/ceramic';
import type { DocumentNode } from 'graphql';
import EventBus from '../common/event-bus';
import { validate } from '../common/validator';
import { z } from 'zod';
import { ExecutionResult } from 'graphql/index';
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
  split,
} from '@apollo/client';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { sha256 } from 'crypto-hash';
import { gql } from 'graphql-tag';
import { getMainDefinition } from '@apollo/client/utilities';

const enum ContextSources {
  DEFAULT = 'gql#DEFAULT',
  COMPOSEDB = 'gql#COMPOSEDB',
}

/** @internal  */
@injectable()
class Gql {
  readonly _client: Sdk;
  readonly _ceramic: CeramicService;
  // #_clientWithCache: Sdk;
  private _log: pino.Logger;
  private _globalChannel: EventBus;
  private readonly _apolloCache: InMemoryCache;
  readonly apolloClient: ApolloClient<unknown>;
  private readonly _contextSources: { default: symbol; composeDB: symbol; };

  public constructor (
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Ceramic) ceramic: CeramicService,
    @inject(TYPES.EventBus) globalChannel: EventBus,
  ) {
    this._log = log.create('AWF_GQL');
    this._globalChannel = globalChannel;
    this._ceramic = ceramic;
    this._contextSources = Object.freeze({
      default: Symbol.for(ContextSources.DEFAULT),
      composeDB: Symbol.for(ContextSources.COMPOSEDB),
    });
    const composeDBlink = new ApolloLink((operation) => {
      return new Observable((observer) => {
        const definition = getMainDefinition(operation.query);
        let uuid: string = '';

        if (definition.kind === 'OperationDefinition' && definition.operation === 'mutation') {
          uuid = crypto.randomUUID();
          sessionStorage.setItem(
            uuid,
            JSON.stringify({ name: operation.operationName, variables: operation.variables }),
          );
          this._globalChannel.next({
            data: { uuid, success: false, pending: true, name: operation.operationName },
            event: GQL_EVENTS.MUTATION,
          });

        }

        this._ceramic.getComposeClient().execute(operation.query, operation.variables).then(
          (result) => {
            observer.next(result);

            if (uuid) {
              this._globalChannel.next({
                data: { uuid, success: true, pending: false, name: operation.operationName },
                event: GQL_EVENTS.MUTATION,
              });
            }

            observer.complete();
          },
          (error) => {
            observer.error(error);

            if (uuid) {
              sessionStorage.setItem(uuid, JSON.stringify({ errors: JSON.stringify(error) }));
              this._globalChannel.next({
                data: { uuid, success: false, errors: error, pending: false },
                event: GQL_EVENTS.MUTATION,
              });
            }
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

    this._apolloCache = new InMemoryCache();

    this.apolloClient = new ApolloClient({
      cache: this._apolloCache,
      link: directionalLink,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only',
          nextFetchPolicy: 'cache-and-network',
        },
      },
    });

    this._client = getSdk(this.requester);
  }

  public requester = async <R, V> (doc: DocumentNode | string, vars?: V, options?: Record<string, any>): Promise<R> => {
    let query: DocumentNode;
    if (typeof doc === 'string') {
      query = gql(doc);
    } else {
      query = doc;
    }
    const result = await this.apolloClient.query({
      query: query,
      variables: vars as Record<string, unknown> | undefined,
      context: options?.context,
    });

    if (!result.errors || !result.errors.length) {
      return result.data as R;
    }
    throw result.errors;
  };

  get queryClient () {
    return this.apolloClient.query;
  }

  get contextSources () {
    return this._contextSources;
  }

  async resetCache () {
    return this._apolloCache.reset();
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

  /**
   * @deprecated Use client method instead
   */
  getAPI () {
    return this._client;
  }

  get client () {
    return this._client;
  }
}

export default Gql;
