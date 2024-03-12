import { IconType, RootComponentProps } from './index';
import { UIEventData } from './ui-events';
import { Extensions } from './apps';
import { PluginConf } from './plugins';
import { IntegrationReleaseInfoFragmentFragment } from '../sdk/graphql-operation-types';

export type ActivityFn = (
  location: Location,
  pathToActiveWhen: (path: string, exact?: boolean) => (location: Location) => boolean,
  layoutConfig?: Extensions,
) => boolean;

export type LayoutConfig = {
  /**
   * load modals inside this node
   */
  modalSlotId?: string;
  /**
   * main app and plugin area
   */
  applicationSlotId?: string;
  /**
   * load root widgets inside this node
   * do not use this for app defined widgets
   */
  rootWidgetSlotId?: string;
  /**
   * load app defined widgets into this node
   */
  widgetSlotId?: string;
  /**
   * topbar loading node
   */
  topbarSlotId?: string;
  /**
   * cookie widget slot
   */
  cookieWidgetSlotId?: string;
  /**
   * sidebar area slot
   */
  sidebarSlotId?: string;
  /**
   * snackbar notification slot
   */
  snackbarNotifSlotId?: string;
};

export interface IntegrationRegistrationOptions {
  worldConfig: {
    title: string;
  };
  uiEvents: RootComponentProps['uiEvents'];
  layoutConfig: LayoutConfig;
  extensionData?: UIEventData['data'];
  plugins?: PluginConf;
  logger: unknown;
}

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
