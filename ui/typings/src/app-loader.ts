import { BehaviorSubject } from 'rxjs';
import { LogoSourceType } from './index';

export interface IntegrationRegistryInfo {
  name: string;
  version?: string;
  description: string;
  src: string;
}

export interface WidgetRegistryInfo extends IntegrationRegistryInfo {
  type: 'widget';
}
export interface AppRegistryInfo extends IntegrationRegistryInfo {
  type: 'app';
}

export type ActivityFn = (
  location: Location,
  pathToActiveWhen: (path: string, exact?: boolean) => (location: Location) => boolean,
  layoutConfig?: LayoutConfig,
) => boolean;

export interface UIEventData {
  event: EventTypes;
  data?: EventDataTypes;
}

export interface ModalNavigationOptions {
  name: string;
  pubKey?: string;
  entryId?: string;
  entryType?: ItemTypes;
  [key: string]: string | unknown | undefined;
}

export interface IntegrationRegistrationOptions {
  worldConfig: {
    title: string;
  };
  uiEvents: BehaviorSubject<UIEventData>;
  layoutConfig?: LayoutConfig;
  isMobile: boolean;
  integrations?: {
    infos: (AppRegistryInfo | WidgetRegistryInfo)[];
    configs: Record<string, IAppConfig | IWidgetConfig>;
  };
  extensionData?: UIEventData['data'];
}

export interface LayoutConfig {
  loadingFn: () => Promise<ISingleSpaLifecycle>;
  mountsIn?: string;
  /**
   * load modals inside this node
   */
  modalSlotId: string;
  name: string;
  /**
   * main app and plugin area
   */
  pluginSlotId: string;
  /**
   * load root widgets inside this node
   * do not use this for app defined widgets
   */
  rootWidgetSlotId: string;
  /**
   * sidebar area slot
   */
  // sidebarSlotId: string;
  title: string;
  /**
   * topbar loading node
   */
  topbarSlotId: string;
  /**
   * load app defined widgets into this node
   */
  widgetSlotId: string;
  sidebarSlotId: string;
}

export interface ExtensionPointDefinition {
  mountsIn: string | ((opts: IntegrationRegistrationOptions) => string | null) | null;
  loadingFn: () => Promise<ISingleSpaLifecycle>;
  parentApp?: string;
  activeWhen?: ActivityFn;
}

export interface IAppConfig {
  activeWhen: ActivityFn;
  /**
   * The id of the html element
   * that this app will mount in
   */
  mountsIn?: string;

  /**
   * routes that are defined here can be used
   * by other apps for navigation
   */
  routes: {
    rootRoute: string;
    [key: string]: string;
  };
  loadingFn: () => Promise<ISingleSpaLifecycle>;
  name: string;
  /**
   * A simple mapping of the extension points exposed by this widget
   */
  extensions?: Record<string, string>;

  /**
   * Defines the component that will be mounted into an extension point
   */
  extends?: ExtensionPointDefinition[];

  /**
   * Keywords that defines this widget.
   * Useful for filtering through integrations
   */
  tags?: string[];

  /**
   * Used for page title
   */
  title: string;
  /**
   * Only used for topbar.
   * Warning: we may deprecate this property
   */
  menuItems?: IMenuItem;
}

export interface IWidgetConfig {
  activeWhen?: ActivityFn;
  name: string;
  notOnMobile?: boolean;
  loadingFn: () => Promise<ISingleSpaLifecycle>;
  /**
   * Id of the element in which this widget is rendered
   */
  mountsIn?: string;
  /**
   * A simple mapping of the extension points exposed by this widget
   */
  extensions?: Record<string, string>;
  extends?: ExtensionPointDefinition[];

  /**
   * Keywords that defines this widget.
   * Useful for filtering/finding integrations
   */
  tags?: string[];
  pluginSlotId?: string;
  topbarSlotId?: string;
  widgetSlotId?: string;
  rootWidgetSlotId?: string;
  /**
   * the path on which the widget will load
   */
  basePath?: string;
  sidebarSlotId?: string;
  modalSlotId?: string;
}

export type IntegrationConfig = IAppConfig | IWidgetConfig | LayoutConfig;

export enum LogLevels {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

export type AppOrWidgetDefinition = string | { name: string; version: string };

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
  defaultApps: AppOrWidgetDefinition[];
  /**
   * Widgets that are installed by default on this world.
   * layout widget is loaded by default, no need to be specified here
   */
  defaultWidgets: AppOrWidgetDefinition[];
  /**
   * The layout widget of this world. This widget always mounts in the root element.
   */
  layout: AppOrWidgetDefinition;
  /**
   * The app to load when you navigate to the home page.
   */
  homepageApp: AppOrWidgetDefinition;
  /**
   * Define this world's title
   */
  title: string;
}

export interface ISingleSpaLifecycle {
  bootstrap: (props: unknown) => Promise<unknown>;
  mount: (props: unknown) => Promise<unknown>;
  unmount: (props: unknown) => Promise<unknown>;
  update?: (props: unknown) => Promise<unknown>;
}

export enum MenuItemType {
  Plugin = 'plugin',
  App = 'app',
  Internal = 'internal',
}

export enum MenuItemAreaType {
  AppArea = 'app-area', // body of sideabr
  QuickAccessArea = 'quick-access-area', // right of topbar
  BottomArea = 'bottom-area', // footer of sidebar
  SearchArea = 'search-area', // middle of topbar
  OtherArea = 'other-area', // not displayed
}

export interface IMenuItem {
  index?: number;
  label: string;
  route: string;
  type?: MenuItemType;
  area?: MenuItemAreaType; // area is optional because subroutes dont have an area to be mounted
  logo?: LogoSourceType;
  name?: string;
  subRoutes?: IMenuItem[];
}

export interface IMenuList {
  nextIndex: number;
  items: IMenuItem[];
}

export enum EventTypes {
  Instantiated = 'instantiated',
  InstallIntegration = 'install-integration',
  UninstallIntegration = 'uninstall-integration',
  ExtensionPointMount = 'extension-point-mount',
  ExtensionPointMountRequest = 'extension-point-mount-request',
  ExtensionPointUnmount = 'extension-point-unmount',
  ExtensionPointUnmountRequest = 'extension-point-unmount-request',
  ModalMountRequest = 'modal-mount-request',
  ModalUnmountRequest = 'modal-unmount-request',
  ModalMount = 'modal-mount',
  ModalUnmount = 'modal-unmount',
  ShowSidebar = 'show-sidebar',
  HideSidebar = 'hide-sidebar',
}

export type EventDataTypes = {
  name: string;
  version?: string;
  entryId?: string;
  entryType?: ItemTypes;
  clickHandler?: () => void;
};

export const enum ItemTypes {
  ENTRY = 0,
  PROFILE,
  COMMENT,
  TAG,
}
