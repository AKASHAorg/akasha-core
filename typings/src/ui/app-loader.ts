import { ReplaySubject, Subject } from 'rxjs';
import { ParcelConfigObject } from 'single-spa';
import { RootComponentProps, RootExtensionProps } from './index';
import { UIEventData } from './ui-events';
import { Extensions, IAppConfig } from './apps';
import { PluginConf } from './plugins';
import { GlobalEventBusData } from '../sdk';
import { IntegrationReleaseInfoFragmentFragment } from '../sdk/graphql-operation-types';

export type ActivityFn = (
  location: Location,
  pathToActiveWhen: (path: string, exact?: boolean) => (location: Location) => boolean,
  layoutConfig?: Extensions,
) => boolean;

export interface IntegrationRegistrationOptions {
  worldConfig: {
    title: string;
  };
  uiEvents: RootComponentProps['uiEvents'];
  layoutConfig: Extensions;
  extensionData?: UIEventData['data'];
  plugins?: PluginConf;
  logger: unknown;
}

export type IntegrationInitOptions = Partial<IntegrationRegistrationOptions>;

export interface ExtensionMatcherFn<G = ReplaySubject<GlobalEventBusData>> {
  (
    uiEvents: Subject<UIEventData>,
    globalChannel: G,
    extProps: Omit<
      RootExtensionProps,
      'uiEvents' | 'extensionData' | 'domElement' | 'baseRouteName'
    >,
    parentConfig: IAppConfig & { name: string },
  ): (extConfig: Record<string, ReturnType<ExtensionLoaderFn>>) => void;
}

/**
 * Extension loader function
 * must return a promise with a singleSpaLifecycle object
 */
export type ExtensionLoaderFn = (
  loadingFunction: () => Promise<ParcelConfigObject<Omit<RootExtensionProps, 'baseRouteName'>>>,
) => {
  load: (props: Omit<RootExtensionProps, 'baseRouteName'>, parentAppName: string) => void;
  unload: (event: UIEventData, parentAppName: string) => void;
};

export type ExtendsFn = (
  matcher: ReturnType<ExtensionMatcherFn>,
  extLoader: ExtensionLoaderFn,
) => void;

export enum LogLevels {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

export enum INTEGRATION_TYPES {
  APPLICATION,
  PLUGIN,
  WIDGET,
}

export interface IntegrationModule {
  register?: (opts: IntegrationRegistrationOptions) => IAppConfig;
  initialize?: (opts: IntegrationInitOptions) => Promise<void> | void;
  getPlugin?: (
    opts: IntegrationRegistrationOptions & {
      encodeAppName: (name: string) => string;
      decodeAppName: (name: string) => string;
    },
  ) => Promise<PluginConf>;
}

export interface ISdkConfig {
  /**
   * Define the log level
   */
  logLevel: LogLevels;
}

/**
 * World configuration object
 */

export interface ILoaderConfig {
  /**
   * Apps that are installed by default on this world.
   * homePageApp is loaded by default, no need to be specified here
   */
  defaultApps: string[];
  /**
   * Widgets that are installed by default on this world.
   * layout widget is loaded by default, no need to be specified here
   */
  defaultWidgets: string[];
  /**
   * The layout widget of this world. This widget always mounts in the root element.
   */
  layout: string;
  /**
   * The app to load when you navigate to the home page.
   */
  homepageApp: string;
  /**
   * Define this world's title
   */
  title: string;
  analytics?: {
    siteId: string;
    trackerUrl: string;
  };
  registryOverrides?: IntegrationReleaseInfoFragmentFragment[];
}

export interface QueryStringType {
  [key: string]: string | string[] | unknown | undefined;
}
