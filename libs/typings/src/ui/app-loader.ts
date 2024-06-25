import { IconType, RootComponentProps } from './index';
import { UIEventData } from './ui-events';
import { Extensions } from './apps';
import { PluginConf } from './plugins';
import { AkashaAppApplicationType } from '../sdk/graphql-types-new';

/**
 * Type defining single-spa activity function
 * @see {@link https://single-spa.js.org/docs/configuration/#configactivewhen}
 */
export type ActivityFn = (
  location: Location,
  pathToActiveWhen: (path: string, exact?: boolean) => (location: Location) => boolean,
  layoutConfig?: Extensions,
) => boolean;

/**
 * Type defining layout slots where apps and widgets are mounted
 */
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

/**
 * Type defining the params of a register function
 */
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

/**
 * Type defining extension info
 **/
export type ExtensionConfig = {
  name: string;
  id?: string;
  integrationType: AkashaAppApplicationType;
  sources: string[];
  version: string;
  integrationID: string;
  author: string;
  enabled: boolean;
  manifestData: {
    mainFile: string;
  };
};

/**
 * Type defining world configuration object
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
  worldIcon?: {
    basePath: string;
    darkModeSuffix: string;
    extension: '.png' | '.webp' | '.jpg' | '.jpeg';
    small: string;
    medium: string;
    large: string;
  };
  analytics?: {
    siteId: string;
    trackerUrl: string;
  };
  registryOverrides?: ExtensionConfig[];
  socialLinks?: { icon: IconType; link: string }[];
};

/**
 * Type defining query string
 **/
export interface QueryStringType {
  [key: string]: string | string[] | unknown | undefined;
}
