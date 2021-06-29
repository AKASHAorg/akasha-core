import IGqlClient from './interfaces/gql';
import ILog from './interfaces/log';
import IStashService from './interfaces/stash';
import ISettingsService, { IAppSettings } from './interfaces/settings';
import IDBService from './interfaces/db';
import { IWeb3Connector } from './interfaces';
import AWF_IIpfsConnector from './interfaces/ipfs.connector';

export default interface IServices {
  gql: IGqlClient<unknown>;
  log: ILog;
  stash: IStashService<unknown>;
  settings: ISettingsService;
  appSettings: IAppSettings;
  db: IDBService<unknown, unknown>;
  common: {
    web3: IWeb3Connector<unknown>;
    ipfs: AWF_IIpfsConnector;
  };
}
