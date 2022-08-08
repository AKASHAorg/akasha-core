/**
 * AKASHA SDK is a modular set of utilities and apis that can be used to build
 * your own app.
 * @packageDocumentation
 */
import 'reflect-metadata';
import 'systemjs-webpack-interop/auto-public-path';
import * as typings from '@akashaorg/typings/sdk';
import container from './container';
import Logging from './logging';
import Settings from './settings';
import Gql from './gql';
import DB from './db';
import Stash from './stash';
import Web3Connector from './common/web3.connector';
import EventBus from './common/event-bus';
import type AWF_Auth from './auth';
import AWF_Profile from './profiles';
import AWF_ENS from './registry/ens';
import AWF_IC_REGISTRY from './registry/icRegistry';
import AWF_Entry from './posts/entry';
import type AWF_Comments from './posts/comments';
import AWF_Tags from './posts/tags';
import AWF_IpfsConnector from './common/ipfs.connector';
import AppSettings from './settings/apps';
import AWF_Misc from './common/misc';

export interface SDK_API {
  globalChannel: EventBus;
  auth: AWF_Auth;
  profile: AWF_Profile;
  ens: AWF_ENS;
  entries: AWF_Entry;
  comments: AWF_Comments;
  tags: AWF_Tags;
  icRegistry: AWF_IC_REGISTRY;
}

export interface SDK_Services {
  log: Logging;
  gql: Gql;
  stash: Stash;
  settings: Settings;
  appSettings: AppSettings;
  db: DB;
  common: {
    web3: Web3Connector;
    ipfs: AWF_IpfsConnector;
    misc: AWF_Misc;
  };
}

export interface AWF_SDK {
  services: SDK_Services;
  api: SDK_API;
}

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
  const ens = container.get<AWF_ENS>(TYPES.ENS);
  const entries = container.get<AWF_Entry>(TYPES.Entry);
  const comments = container.get<AWF_Comments>(TYPES.Comment);
  const tags = container.get<AWF_Tags>(TYPES.Tag);
  const ipfs = container.get<AWF_IpfsConnector>(TYPES.IPFS);
  const appSettings = container.get<AppSettings>(TYPES.AppSettings);
  const icRegistry = container.get<AWF_IC_REGISTRY>(TYPES.ICRegistry);
  const misc = container.get<AWF_Misc>(TYPES.Misc);
  return {
    services: {
      log,
      gql,
      stash,
      settings,
      appSettings,
      db,
      common: {
        web3,
        ipfs,
        misc,
      },
    },
    api: {
      globalChannel,
      auth,
      profile,
      ens,
      entries,
      comments,
      tags,
      icRegistry,
    },
  };
}

export { typings };
