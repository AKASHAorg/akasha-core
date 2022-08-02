import type IDBService from './db';
import type IGqlClient from './gql';
import type ILogService from './log';
import type ISettingsService from './settings';
import type { IAppSettings } from './settings';
import type IStashService from './stash';
import type {
  ServiceCallResult,
  LinkPreview_Response,
  Post_Response,
  PostsResult_Response,
} from './responses';
import type { IWeb3Connector } from './web3.connector';
import { EthProviders } from './web3.connector';
import type AWF_IAuth from './auth';
import type AWF_IIpfsConnector from './ipfs.connector';

import ILog, { ILogger } from './log';
import { ReplaySubject } from 'rxjs';
import { GlobalEventBusData } from './common';
import {
  AWF_IENS,
  AWF_IIC_REGISTRY,
  IntegrationInfo,
  ReleaseInfo,
  AWF_APP_BUILD_MANIFEST,
  AWF_APP_SOURCE_MANIFEST,
} from './registry';
import { AWF_IComments, AWF_IEntry, AWF_ITags } from './posts';
import AWF_IProfile from './profile';

export * from './events';
export * from './responses';
export * from './common';
export * from './auth';
export * from './stash';
export * from './settings';

export {
  IDBService,
  ServiceCallResult,
  IGqlClient,
  ILogService,
  IntegrationInfo,
  ReleaseInfo,
  ISettingsService,
  IStashService,
  EthProviders,
  IWeb3Connector,
  AWF_IAuth,
  AWF_IIpfsConnector,
  IAppSettings,
  ILog,
  ILogger,
  ServiceTypes as TYPES,
  AWF_APP_BUILD_MANIFEST,
  AWF_APP_SOURCE_MANIFEST,
  LinkPreview_Response,
  Post_Response,
  PostsResult_Response,
  AWF_IIC_REGISTRY,
  AWF_IComments,
  AWF_IProfile,
  AWF_IENS,
  AWF_IEntry,
  AWF_ITags,
};

const ServiceTypes = {
  Gql: Symbol.for('awf-Gql'),
  Stash: Symbol.for('awf-Stash'),
  Log: Symbol.for('awf-Log'),
  Settings: Symbol.for('awf-Settings'),
  AppSettings: Symbol.for('awf-app-Settings'),
  Db: Symbol.for('awf-Db'),
  Web3: Symbol.for('awf-Web3'),
  EventBus: Symbol.for('awf-EventBus'),
  Auth: Symbol.for('awf-AUTH'),
  ENS: Symbol.for('awf-ENS'),
  Profile: Symbol.for('awf-Profile'),
  Entry: Symbol.for('awf-Entry'),
  Comment: Symbol.for('awf-Comment'),
  Tag: Symbol.for('awf-Tag'),
  IPFS: Symbol.for('awf-IPFS'),
  ICRegistry: Symbol.for('awf-ic-Registry'),
  Misc: Symbol.for('awf-Misc'),
};

export interface IServices {
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

export interface IAwfSDK {
  services: IServices;
  api: {
    globalChannel: ReplaySubject<GlobalEventBusData>;
    auth: AWF_IAuth;
    ens: AWF_IENS;
    profile: AWF_IProfile;
    entries: AWF_IEntry;
    tags: AWF_ITags;
    comments: AWF_IComments;
    icRegistry: AWF_IIC_REGISTRY;
  };
}
