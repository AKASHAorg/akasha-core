import { TYPES, AwfSDK } from '@akashaproject/sdk-typings';
import container from './container';
import ILogService from '@akashaproject/sdk-typings/lib/interfaces/log';
import IStashService from '@akashaproject/sdk-typings/lib/interfaces/stash';
import ISettingsService from '@akashaproject/sdk-typings/lib/interfaces/settings';
import { Gql } from './gql';
import { DB } from './db';

export default function init(): AwfSDK {
  const log = container.get<ILogService>(TYPES.Log);
  const gql = container.get<Gql>(TYPES.Gql);
  const stash = container.get<IStashService>(TYPES.Stash);
  const settings = container.get<ISettingsService>(TYPES.Settings);
  const db = container.get<DB>(TYPES.Db);
  return {
    services: {
      log,
      gql,
      stash,
      settings,
      db,
    },
    api: null,
  };
}
