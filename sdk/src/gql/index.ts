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
    const { optionName } = this.mutationNotificationConfig;
    const requester = async <R, V> (doc: DocumentNode, vars?: V, options?: Record<string, unknown>): Promise<R> => {
      const call = this._ceramic
        .getComposeClient()
        .execute(doc, vars as Record<string, unknown> | undefined);

      const result = options?.hasOwnProperty(optionName) ?
        await this.wrapWithMutationEvent(call, JSON.stringify(options[optionName])) : await call;

      if (!result.errors || !result.errors.length) {
        return result.data as R;
      }
      throw result.errors;
    };

    this._client = getSdk(requester);
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
      optionName: 'emitNotification',
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
