/**
 * @packageDocumentation The AKASHA SDK is used in every world instance and
 * provides the core functionality to interact with different services and 3rd parties
 * (ex. Metamask, Lit Protocol, Ceramic, ComposeDB, Infura, etc.).
 * It is a wrapper around the services and APIs that are used in the AKASHA world.
 */
import 'reflect-metadata';
import * as typings from '@akashaorg/typings/lib/sdk';
import container from './container';

import type AWF_Auth from './auth';
import type DB from './db';
import type Gql from './gql';
import type AWF_Profile from './profiles';
import type Logging from './logging';
import type Settings from './settings';
import type AppSettings from './settings/apps';
import type Stash from './stash';
import type AWF_Ceramic from './common/ceramic';
import type EventBus from './common/event-bus';
import type AWF_IpfsConnector from './common/ipfs.connector';
import type AWF_Lit from './common/lit';
import type AWF_Misc from './common/misc';
import type Notification from './common/notification/notification';
import type Web3Connector from './common/web3.connector';
import AWF_WORLD_CONFIG from './world-config/world-config';

export { Logger } from 'pino';

export type AWF_SDK = {
  services: {
    log: Logging;
    gql: Gql;
    stash: Stash;
    settings: Settings;
    appSettings: AppSettings;
    ceramic: AWF_Ceramic;
    db: DB;
    worldConfig: AWF_WORLD_CONFIG;
    common: {
      web3: Web3Connector;
      ipfs: AWF_IpfsConnector;
      misc: AWF_Misc;
      lit: AWF_Lit;
      notification: Notification;
    };
  };
  api: {
    globalChannel: EventBus;
    auth: AWF_Auth;
    profile: AWF_Profile;
  };
};

let sdk: AWF_SDK;

/**
 * Creates a new SDK instance or returns a previusly created one.
 * @public
 * @example
 * ```ts
 * import getSDK from '@akashaorg/core-sdk';
 *
 * const sdk = getSDK();
 * // do something with SDK
 * ```
 */
export default function getSDK(): AWF_SDK {
  if (!sdk) {
    sdk = init();
  }
  return sdk;
}

/**
 * Creates a new SDK instance.
 * @public
 * @example Example usage
 * ```ts
 * import { init } from '@akashaorg/core-sdk';
 *
 * const sdk = init();
 *
 * const { log, gql, stash, settings, appSettings, ceramic, db, common } = sdk.services;
 * ```
 */
export function init(): AWF_SDK {
  const { TYPES } = typings;
  const log = container.get<Logging>(TYPES.Log);
  const gql = container.get<Gql>(TYPES.Gql);
  const stash = container.get<Stash>(TYPES.Stash);
  const db = container.get<DB>(TYPES.Db);
  const settings = container.get<Settings>(TYPES.Settings);
  const web3 = container.get<Web3Connector>(TYPES.Web3);
  const globalChannel = container.get<EventBus>(TYPES.EventBus);
  const auth = container.get<AWF_Auth>(TYPES.Auth);
  const profile = container.get<AWF_Profile>(TYPES.Profile);
  const ipfs = container.get<AWF_IpfsConnector>(TYPES.IPFS);
  const appSettings = container.get<AppSettings>(TYPES.AppSettings);
  const misc = container.get<AWF_Misc>(TYPES.Misc);
  const notification = container.get<Notification>(TYPES.Notification);
  const ceramic = container.get<AWF_Ceramic>(TYPES.Ceramic);
  const lit = container.get<AWF_Lit>(TYPES.Lit);
  const worldConfig = container.get<AWF_WORLD_CONFIG>(TYPES.WorldConfig);

  return {
    services: {
      log,
      gql,
      stash,
      settings,
      appSettings,
      ceramic,
      db,
      worldConfig,
      common: {
        web3,
        ipfs,
        misc,
        lit,
        notification,
      },
    },
    api: {
      globalChannel,
      auth,
      profile,
    },
  };
}
