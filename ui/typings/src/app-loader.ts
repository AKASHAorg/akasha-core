import { Application, LogoSourceType } from './index';

export interface IPluginConfig {
  activeWhen?: {
    exact?: boolean;
    path: string;
  };
  title?: string;
}

export interface ILoaderConfig {
  rootNodeId: string;
  layout: IWidget;
}

export interface IWidgetConfig {
  slot: string;
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

export interface IWidget {
  name: string;
  i18nConfig?: II18nConfig;
  loadingFn: () => Promise<any>;
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

export interface IMenuItem {
  index: number;
  label: string;
  route: string;
  type: MenuItemType;
  logo?: LogoSourceType;
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
