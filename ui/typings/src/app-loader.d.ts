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
  layout: IWidgetEntry;
  rootLoadedApp: IPluginEntry;
  System: any;
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
export interface IPlugin extends Application {}
export interface ISingleSpaLifecycle {
  bootstrap: (props: any) => Promise<void>;
  mount: (props: any) => Promise<void>;
  unmount: (props: any) => Promise<void>;
  update?: (props: any) => Promise<void>;
}
export interface IScriptSrc {
  src: string;
  name: string;
  moduleName: string;
}
export interface IWidget {
  name: string;
  i18nConfig?: II18nConfig;
  loadingFn: () => Promise<ISingleSpaLifecycle>;
  pluginSlotId?: string;
  topbarSlotId?: string;
  widgetSlotId?: string;
  rootWidgetSlotId?: string;
  sdkModules?: SDKdependency[];
  /**
   * the path on which the widget will load
   */
  basePath?: string;
}
export declare enum MenuItemType {
  Plugin = 'plugin',
  App = 'app',
  Internal = 'internal',
}
export declare enum MenuItemAreaType {
  AppArea = 'app-area',
  QuickAccessArea = 'quick-access-area',
  BottomArea = 'bottom-area',
  SearchArea = 'search-area',
  OtherArea = 'other-area',
}
export interface IMenuItem {
  index: number;
  label: string;
  route: string;
  type: MenuItemType;
  area?: MenuItemAreaType;
  logo?: LogoSourceType;
  name?: string;
  subRoutes?: IMenuItem[];
}
export interface IMenuList {
  nextIndex: number;
  items: IMenuItem[];
}
export declare enum EventTypes {
  Instantiated = 'instantiated',
  AppInstall = 'app-install',
  PluginInstall = 'plugin-install',
  WidgetInstall = 'widget-install',
  AppOrPluginUninstall = 'app-plugin-uninstall',
}
