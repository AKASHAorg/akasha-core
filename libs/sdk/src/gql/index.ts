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
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
  split,
  gql,
  FetchResult,
} from '@apollo/client';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { sha256 } from 'crypto-hash';
import { getMainDefinition, relayStylePagination } from '@apollo/client/utilities';

import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import { VIEWER_ID_HEADER } from '@composedb/constants';
import AWF_Config from '../common/config';

const enum ContextSources {
  DEFAULT = 'gql#DEFAULT',
  COMPOSEDB = 'gql#COMPOSEDB',
}

export const LabelTypes = {
  TAG: 'core#tag',
  CATEGORY: 'core#category',
  INTEREST: 'core#interest',
  MENTION: 'core#mention',
} as const;

declare const __DEV__: boolean;

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

/** @internal  */
@injectable()
class Gql {
  readonly _client: Sdk;
  readonly _ceramic: CeramicService;
  // #_clientWithCache: Sdk;
  private _log: pino.Logger;
  private _globalChannel: EventBus;
  private _viewerID: string;
  private readonly _apolloCache: InMemoryCache;
  readonly apolloClient: ApolloClient<any>;
  private readonly _contextSources: { default: symbol; composeDB: symbol };
  private _config: AWF_Config;

  public constructor(
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Ceramic) ceramic: CeramicService,
    @inject(TYPES.EventBus) globalChannel: EventBus,
    @inject(TYPES.Config) config: AWF_Config,
  ) {
    this._log = log.create('AWF_GQL');
    this._globalChannel = globalChannel;
    this._ceramic = ceramic;
    this._viewerID = '';
    this._config = config;
    this._contextSources = Object.freeze({
      default: Symbol.for(ContextSources.DEFAULT),
      composeDB: Symbol.for(ContextSources.COMPOSEDB),
    });

    /*
     * composeDBLink
     *
     * Creates an ApolloLink that sends GraphQL operations to ComposeDB.
     *
     * This uses the Ceramic service to get the ComposeDB client instance,
     * and calls the execute() method on it, passing the operation's
     * query and variables.
     *
     * The result or error is passed back to the Observable observer.
     *
     * Parameters:
     *
     * - operation: The GraphQL operation to send to ComposeDB
     *
     * Returns:
     *
     * - An Observable for the GraphQL operation result
     */
    const composeDBlink = new ApolloLink(operation => {
      return new Observable(observer => {
        this._ceramic
          .getComposeClient()
          .execute(operation.query, operation.variables)
          .then(
            result => {
              observer.next(result);
              observer.complete();
            },
            error => {
              observer.error(error);
            },
          );
      });
    });

    /*
     * directionalLink
     *
     * Creates a split ApolloLink that routes GraphQL operations to different links
     * based on the context source.
     *
     * Operations from the 'composeDB' context source will be sent to the composeDBLink.
     *
     * All other operations will be sent to a link that combines:
     *
     * - A persisted query link
     * - A standard HTTP link to the GraphQL server
     *
     * Parameters:
     *
     * - operation: The GraphQL operation
     *
     * Returns:
     *
     * - The link to use for the operation based on its context source
     */
    const directionalLink = split(
      operation => {
        return operation.getContext().source === this.contextSources.composeDB;
      },
      composeDBlink,
      createPersistedQueryLink({ sha256, useGETForHashedQueries: true }).concat(
        new HttpLink({ uri: this._config.getOption('graphql_uri') || 'http://localhost:4112/' }),
      ),
    );

    this._apolloCache = new InMemoryCache({
      typePolicies: {
        AkashaBeam: {
          merge: true,
        },
        AkashaReflectConnection: {
          merge: true,
        },
        AkashaFollow: {
          merge: true,
        },
        CeramicAccount: {
          merge: true,
          fields: {
            akashaFollowList: relayStylePagination(['sorting', 'filters']),
          },
        },
        AkashaProfile: {
          merge: true,
          fields: {
            followers: relayStylePagination(['sorting', 'filters']),
          },
        },
        Query: {
          fields: {
            akashaBeamIndex: relayStylePagination(['sorting', 'filters']),
          },
        },
      },
    });

    this.apolloClient = new ApolloClient({
      cache: this._apolloCache,
      link: directionalLink,
      version: '0.1.1dev',
      connectToDevTools: __DEV__,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only',
          nextFetchPolicy: 'cache-and-network',
        },
      },
    });

    this._client = getSdk(this.requester);
  }

  /*
   * requester
   *
   * Sends a GraphQL operation to the Apollo client and handles errors.
   *
   * Parameters:
   *
   * - doc: The GraphQL document node or string
   * - vars: Optional variables
   * - options: Additional context options
   *
   * Returns:
   *
   * - The result data for queries
   *
   * For mutations:
   *
   * - Generates a UUID
   * - Publishes mutation notifications via globalChannel
   * - Stores errors in sessionStorage
   * - Throws errors
   *
   * Checks if doc is a string and converts to DocumentNode.
   *
   * Checks for mutation and handles notifications.
   *
   * Otherwise sends as standard query.
   *
   * Throws errors if present.
   */
  public requester = async <R, V>(
    doc: DocumentNode | string,
    vars?: V,
    options?: Record<string, any>,
  ): Promise<R> => {
    let query: DocumentNode;
    if (typeof doc === 'string') {
      query = gql(doc);
    } else {
      query = doc;
    }
    let uuid = '';
    const definition = getMainDefinition(query);
    const context = {
      ...options?.context,
      headers: this._viewerID
        ? {
            [VIEWER_ID_HEADER]: this._viewerID,
          }
        : {},
    };
    let result: FetchResult<unknown, Record<string, unknown>, Record<string, unknown>>;
    if (definition.kind === 'OperationDefinition' && definition.operation === 'mutation') {
      uuid = crypto.randomUUID();
      sessionStorage.setItem(uuid, JSON.stringify({ variables: definition.variableDefinitions }));
      this._globalChannel.next({
        data: { uuid, success: false, pending: true },
        event: GQL_EVENTS.MUTATION,
      });
      result = await this.apolloClient.mutate({
        mutation: query,
        variables: vars as Record<string, unknown> | undefined,
        context: context,
      });
    } else {
      result = await this.apolloClient.query({
        query: query,
        variables: vars as Record<string, unknown> | undefined,
        context: context,
      });
    }

    if (!result.errors || !result.errors.length) {
      if (uuid) {
        this._globalChannel.next({
          data: { uuid, success: true, pending: false, variables: definition.variableDefinitions },
          event: GQL_EVENTS.MUTATION,
        });
      }
      return result.data as R;
    }

    sessionStorage.setItem(uuid, JSON.stringify({ errors: JSON.stringify(result.errors) }));
    this._globalChannel.next({
      data: { uuid, success: false, errors: result.errors, pending: false },
      event: GQL_EVENTS.MUTATION,
    });
    throw result.errors;
  };

  get queryClient() {
    return this.apolloClient;
  }

  get contextSources() {
    return this._contextSources;
  }

  get labelTypes() {
    return LabelTypes;
  }

  get indexingDID() {
    return this._config.getOption('indexing_did');
  }

  async resetCache() {
    return this._apolloCache.reset();
  }

  async setContextViewerID(id: string) {
    this._viewerID = id;
    await this.resetCache();
  }

  get mutationNotificationConfig() {
    return Object.freeze({
      optionName: 'EmitNotification',
    });
  }

  @validate(z.string().min(20))
  consumeMutationNotificationObject(uuid: string) {
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
  getAPI() {
    return this._client;
  }

  get client() {
    return this._client;
  }
}

export default Gql;
