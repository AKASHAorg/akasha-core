import 'reflect-metadata';
import * as typings from '@akashaproject/sdk-typings';
import container from './container';
import Logging from './logging';
import Settings from './settings';
import Gql from './gql';
import DB from './db';
import Stash from './stash';
import Web3Connector from './common/web3.connector';
import EventBus from './common/event-bus';
import AWF_Auth from './auth';
import AWF_Profile from './profiles';
import AWF_ENS from './registry';
import AWF_Entry from './posts/entry';
import AWF_Comments from './posts/comments';
import AWF_Tags from './posts/tags';

let sdk: {
  services: {
    log: Logging;
    gql: Gql;
    stash: Stash;
    settings: Settings;
    db: DB;
    common: {
      web3: Web3Connector;
    };
  };
  api: {
    globalChannel: EventBus;
    auth: AWF_Auth;
    profile: AWF_Profile;
    ens: AWF_ENS;
    entries: AWF_Entry;
    comments: AWF_Comments;
    tags: AWF_Tags;
  };
} = undefined;

export default function getSDK() {
  if (!sdk) {
    sdk = init();
  }
  return sdk;
}

export function init() {
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
  return {
    services: {
      log,
      gql,
      stash,
      settings,
      db,
      common: {
        web3,
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
    },
  };
}

export { typings };
