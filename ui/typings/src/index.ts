import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
export { EthProviders } from '@akashaproject/sdk-typings/lib/interfaces/web3.connector';
export {
  AUTH_EVENTS,
  ENS_EVENTS,
  ENTRY_EVENTS,
  COMMENTS_EVENTS,
  TAG_EVENTS,
  PROFILE_EVENTS,
  WEB3_EVENTS,
} from '@akashaproject/sdk-typings/lib/interfaces/events';
import { IntegrationInfo, ReleaseInfo } from '@akashaproject/sdk-typings/lib/interfaces/registry';
import { Observable, Subject } from 'rxjs';
import singleSpa from 'single-spa';
import * as AppLoaderTypes from './app-loader';
import i18n from 'i18next';
import { AnalyticsEventData } from './analytics';

export interface IAkashaError {
  errorKey: string;
  error: Error;
  critical: boolean;
}

export interface LogoSourceType {
  type: LogoTypeSource;
  value: string;
}
export type AppNameSelector = (apps: Map<string, AppLoaderTypes.IAppConfig>) => string;
export type PathNameSelector = (appRoutes: AppLoaderTypes.IAppConfig['routes']) => string;

export interface NavigationOptions {
  appName?: string | AppNameSelector;
  pathName?: string | PathNameSelector;
  queryStrings?: string | NavigationFn;
}

export type NavigationFn = (
  stringfyFn: (obj: unknown) => string,
  currentRedirect?: string,
) => string;

export interface QueryStringType {
  [key: string]: string | string[] | unknown | undefined;
}

export interface RootComponentProps {
  activeWhen?: { path: string };
  domElement: HTMLElement;
  uiEvents: Subject<AppLoaderTypes.UIEventData | AnalyticsEventData>;
  i18next?: typeof i18n;
  plugins?: Record<string, IPluginsMap>;
  layoutConfig: AppLoaderTypes.IAppConfig['extensions'];
  logger: ILogger;
  name?: string;
  singleSpa: typeof singleSpa;
  /*
   * @deprecated
   */
  installIntegration?: (name: string) => void;
  /*
   * @deprecated
   */
  uninstallIntegration?: (name: string) => void;
  navigateToModal: (opts: AppLoaderTypes.ModalNavigationOptions) => void;
  activeModal: AppLoaderTypes.ModalNavigationOptions;
  getAppRoutes?: (appId: string) => AppLoaderTypes.IAppConfig['routes'];
  worldConfig: AppLoaderTypes.ILoaderConfig;
  navigateTo: (options: string | NavigationOptions | NavigationFn) => void;
  parseQueryString: (queryString: string) => QueryStringType;
}

export interface IPluginsMap {
  [namespace: string]: any;
}

export interface RootExtensionProps extends RootComponentProps {
  extensionData: AppLoaderTypes.UIEventData['data'];
}

export enum LogoTypeSource {
  ICON = 'icon',
  String = 'string',
  IPFS = 'ipfs',
  AVATAR = 'avatar',
}

export enum LEGAL_DOCS {
  TERMS_OF_USE = 'TermsOfUse',
  TERMS_OF_SERVICE = 'TermsOfService',
  PRIVACY_POLICY = 'PrivacyPolicy',
  CODE_OF_CONDUCT = 'CodeOfConduct',
  APP_GUIDE = 'AppGuide',
}

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

export type QueryStatus = {
  status?: 'idle' | 'loading' | 'success' | 'error';
  error?: null | unknown;
  hasNextPage?: boolean;
  isError?: boolean;
  isFetched?: boolean;
  isFetchedAfterMount?: boolean;
  isFetching?: boolean;
  isIdle?: boolean;
  isLoading?: boolean;
  isLoadingError?: boolean;
  isPlaceholderData?: boolean;
  isPreviousData?: boolean;
  isRefetchError?: boolean;
  isStale?: boolean;
  isSuccess?: boolean;
};

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

export { IntegrationInfo, ReleaseInfo };

export interface IntegrationCenterApp extends IntegrationInfo {
  avatar?: string;
  coverImage?: string;
  description?: string;
  releases?: ReleaseInfo[];
  authors?: string[];
  tags?: string[];
  license?: string;
}

export type ValueOf<T> = T[keyof T];

export enum AppTypes {
  APP = 'App',
  WIDGET = 'Widget',
  PLUGIN = 'Plugin',
  NONE = 'None',
}
