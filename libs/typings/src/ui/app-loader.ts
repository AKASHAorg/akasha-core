import { IconType, ExtensionManifest, IRootComponentProps } from './index';
import { UIEventData } from './ui-events';
import { IPlugin } from './plugins';

/**
 * Type defining single-spa activity function
 * @see {@link https://single-spa.js.org/docs/configuration/#configactivewhen}
 */
export type ActivityFn = (
  location: Location,
  pathToActiveWhen: (path: string, exact?: boolean) => (location: Location) => boolean,
  layoutConfig?: LayoutSlots,
) => boolean;

/**
 * Type defining layout slots where apps and widgets among others are loaded
 */
export type LayoutSlots = {
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
  contextualWidgetSlotId?: string;
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
 * Type defining the params of a register function used by app-loader to load apps
 */
export interface IntegrationRegistrationOptions {
  worldConfig: {
    title: string;
  };
  uiEvents: IRootComponentProps['uiEvents'];
  layoutSlots: LayoutSlots;
  extensionData?: UIEventData['data'];
  plugins?: IPlugin;
  logger: unknown;
}

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
  registryOverrides?: ExtensionManifest[];
  socialLinks?: { icon: IconType; link: string }[];
};

/**
 * Interface defining query string
 **/
export interface IQueryString {
  [key: string]: string | string[] | unknown | undefined;
}
