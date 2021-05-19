import IGqlClient from './interfaces/gql';
import ILog from './interfaces/log';
import IStashService from './interfaces/stash';
import ISettingsService from './interfaces/settings';
import IDBService from './interfaces/db';
import { IWeb3Connector } from './interfaces';

export default interface IServices {
  gql: IGqlClient<unknown>;
  log: ILog;
  stash: IStashService<unknown>;
  settings: ISettingsService;
  db: IDBService<unknown, unknown>;
  common: {
    web3: IWeb3Connector<unknown>;
  };
}
