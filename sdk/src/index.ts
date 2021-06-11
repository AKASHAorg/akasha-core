import 'reflect-metadata';
import { TYPES, AwfSDK } from '@akashaproject/sdk-typings';
import container from './container';
import Logging from './logging';
import Settings from './settings';
import Gql from './gql';
import DB from './db';
import Stash from './stash';
import Web3Connector from './common/web3.connector';
import EventBus from './common/event-bus';
import AWF_Auth from './auth';

export default function init(): AwfSDK {
  const log = container.get<Logging>(TYPES.Log);
  const gql = container.get<Gql>(TYPES.Gql);
  const stash = container.get<Stash>(TYPES.Stash);
  const db = container.get<DB>(TYPES.Db);
  const settings = container.get<Settings>(TYPES.Settings);
  const web3 = container.get<Web3Connector>(TYPES.Web3);
  const globalChannel = container.get<EventBus>(TYPES.EventBus);
  const auth = container.get<AWF_Auth>(TYPES.Auth);
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
    },
  };
}
