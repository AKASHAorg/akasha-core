/**
 * AKASHA SDK is a modular set of utilities and apis that can be used to build
 * your own app.
 * @packageDocumentation
 */
import 'reflect-metadata';
import 'systemjs-webpack-interop/auto-public-path/index.js';
import * as typings from '@akashaorg/typings/lib/sdk/index.js';
import container /*, { importLazy }*/ from './container.js';
import type Logging from './logging/index.js';
import type Settings from './settings/index.js';
import type Gql from './gql/index.js';

import type DB from './db/index.js';
import type Stash from './stash/index.js';
import type Web3Connector from './common/web3.connector.js';
import type EventBus from './common/event-bus.js';
import type AWF_Auth from './auth/index.js';
import type AWF_Profile from './profiles/index.js';
import type AWF_IpfsConnector from './common/ipfs.connector.js';
import type AppSettings from './settings/apps.js';
import type AWF_Misc from './common/misc.js';
import type AWF_Ceramic from './common/ceramic.js';
import type AWF_Lit from './common/lit.js';

export { Logger } from 'pino';

export interface SDK_API {
  globalChannel: EventBus;
  auth: AWF_Auth;
  profile: AWF_Profile;
}

export interface SDK_Services {
  log: Logging;
  gql: Gql;
  stash: Stash;
  settings: Settings;
  appSettings: AppSettings;
  ceramic: AWF_Ceramic;
  db: DB;
  common: {
    web3: Web3Connector;
    ipfs: AWF_IpfsConnector;
    misc: AWF_Misc;
    lit: AWF_Lit;
  };
}

export type AWF_SDK = {
  services: SDK_Services;
  api: SDK_API;
};

let sdk: AWF_SDK;

/**
 * Creates a new SDK instance or returns a previusly created one.
 * @public
 * @example
 * ```ts
 * import getSDK from '@akashaorg/awf-sdk';
 * const sdk = getSDK();
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
 * @example
 * ```ts
 * import {init} from '@akashaorg/awf-sdk';
 * const sdk = init();
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
  // const fetchService = async () => {
  //   // await importLazy();
  //   const gqlNew = container.get<Gql>(TYPES.Gql);
  //   console.info('new gql client', gqlNew);
  //   return gqlNew;
  // };
  //
  // console.log('lazy load gql client', fetchService);

  const ceramic = container.get<AWF_Ceramic>(TYPES.Ceramic);
  const lit = container.get<AWF_Lit>(TYPES.Lit);

  return {
    services: {
      log,
      gql,
      stash,
      settings,
      appSettings,
      ceramic,
      db,
      common: {
        web3,
        ipfs,
        misc,
        lit,
      },
    },
    api: {
      globalChannel,
      auth,
      profile,
    },
  };
}

export { typings };
