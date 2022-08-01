export * from './root-component';
export * from './app-loader';
export * from './analytics';
export * from './apps';
export * from './editor';
export * from './entry';
export * from './menu-items';
export * from './navigation';
export * from './plugins';
export * from './profile';
export * from './root-component';
export * from './single-spa';
export * from './type-utils';
export * from './ui-events';
export * from './widgets';

export enum IntegrationTypes {
  APP = 'App',
  WIDGET = 'Widget',
  PLUGIN = 'Plugin',
  NONE = 'None',
}

export interface IAkashaError {
  errorKey: string;
  error: Error;
  critical: boolean;
}

export interface WalletTransactionError extends Error {
  code: number;
  message: string;
  stack: string;
}

import { IntegrationInfo, ReleaseInfo } from '@akashaorg/sdk-typings/lib/interfaces/registry';

/* @TODO: this doesn't belong here */
export interface IntegrationCenterApp extends IntegrationInfo {
  avatar?: string;
  coverImage?: string;
  description?: string;
  releases?: ReleaseInfo[];
  authors?: string[];
  tags?: string[];
  license?: string;
}

export enum LEGAL_DOCS {
  TERMS_OF_USE = 'TermsOfUse',
  TERMS_OF_SERVICE = 'TermsOfService',
  PRIVACY_POLICY = 'PrivacyPolicy',
  CODE_OF_CONDUCT = 'CodeOfConduct',
  APP_GUIDE = 'AppGuide',
}

/* @TODO: this doesn't belong here */
export enum ButtonValues {
  ALL = 'All',
  KEPT = 'Kept',
  DELISTED = 'Delisted',
  STATS = 'Stats',
}

export enum ModerationItemTypes {
  ACCOUNT = 'account',
  POST = 'post',
  COMMENT = 'comment',
  REPLY = 'reply',
  // @TODO: add support for tag type, when tag moderation is implemented
}
