import { ReplaySubject, Subject } from 'rxjs';
import { ParcelConfigObject } from 'single-spa';
import { EventDataTypes, IconType, RootComponentProps, RootExtensionProps } from './index';

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

export interface ExtensionMatcherFn<G = ReplaySubject<GlobalEventBusData>> {
  (
    uiEvents: RootComponentProps['uiEvents'],
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
  unmount: (event: { data?: EventDataTypes }, parentAppName: string) => Promise<void>;
  update: (props: Omit<RootExtensionProps, 'baseRouteName'>, parentAppName: string) => void;
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

/**
 * World configuration object
 */
export type WorldConfig = {
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
  socialLinks?: { icon: IconType; link: string }[];
};

export interface QueryStringType {
  [key: string]: string | string[] | unknown | undefined;
}
