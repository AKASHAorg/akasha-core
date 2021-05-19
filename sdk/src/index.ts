import { TYPES, AwfSDK } from '@akashaproject/sdk-typings';
import container from './container';
import { Logging } from './logging';
import { Settings } from './settings';
import { Gql } from './gql';
import { DB } from './db';
import { Stash } from './stash';
import { Web3Connector } from './common/web3.connector';

export default function init(): AwfSDK {
  const log = container.get<Logging>(TYPES.Log);
  const gql = container.get<Gql>(TYPES.Gql);
  const stash = container.get<Stash>(TYPES.Stash);
  const settings = container.get<Settings>(TYPES.Settings);
  const db = container.get<DB>(TYPES.Db);
  const web3 = container.get<Web3Connector>(TYPES.Web3);
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
    api: null,
  };
}
