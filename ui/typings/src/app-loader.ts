import { Application, LogoSourceType } from './index';

export interface IPluginConfig {
  activeWhen?: {
    exact?: boolean;
    path: string;
  };
  title?: string;
  area?: MenuItemAreaType;
}

export interface ILoaderConfig {
  rootNodeId: string;
  layout: IWidget;
}

export interface IWidgetConfig {
  slot: string;
  notOnMobile?: boolean;
}
export interface SDKdependency {
  module: string;
  services?: string[];
}
export interface IPluginEntry {
  app: IPlugin;
  config?: IPluginConfig;
}

// tslint:disable-next-line:no-empty-interface
export interface IAppEntry extends IPluginEntry {}

export interface IWidgetEntry {
  app: IWidget;
  config?: IWidgetConfig;
}

export interface II18nConfig {
  use: any[];
  loadNS?: string[];
  ns?: string;
}

// tslint:disable-next-line:no-empty-interface
export interface IPlugin extends Application {}

export interface ISingleSpaLifecycle {
  bootstrap: (props: any) => Promise<void>;
  mount: (props: any) => Promise<void>;
  unmount: (props: any) => Promise<void>;
  update?: (props: any) => Promise<void>;
}

export interface IWidget {
  name: string;
  i18nConfig?: II18nConfig;
  loadingFn: () => Promise<ISingleSpaLifecycle>;
  pluginSlotId?: string;
  topbarSlotId?: string;
  sidebarSlotId?: string;
  sdkModules?: SDKdependency[];
}

export enum MenuItemType {
  Plugin = 'plugin',
  App = 'app',
  Internal = 'internal',
}

export enum MenuItemAreaType {
  AppArea = 'app-area', // body
  QuickAccessArea = 'quick-access-area', // top
  BottomArea = 'bottom-area', // footer
  OtherArea = 'other-area', // not displayed
}

export interface IMenuItem {
  index: number;
  label: string;
  route: string;
  type: MenuItemType;
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
  AppInstall = 'app-install',
  PluginInstall = 'plugin-install',
  WidgetInstall = 'widget-install',
  AppOrPluginUninstall = 'app-plugin-uninstall',
}
