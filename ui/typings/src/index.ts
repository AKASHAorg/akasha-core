import * as AppLoaderTypes from './app-loader';

export interface LogoSourceType {
  type: LogoTypeSource;
  value: string;
}
export interface Application {
  activeWhen: { path: string; exact?: boolean };
  i18nConfig: AppLoaderTypes.II18nConfig;
  loadingFn: () => Promise<any>;
  name: string;
  sdkModules?: AppLoaderTypes.SDKdependency[];
  title: string;
  menuItems?: { [p: string]: string };
  logo?: LogoSourceType;
  /**
   * Declare widgets loaded in the widget area of the layout
   * key => string
   * value => an array of widgets
   *          widget = singlespa lifecycle methods
   */
  widgets?: {
    [key: string]: AppLoaderTypes.IWidget[];
  };
}
export interface LayoutConfig {
  loadingFn: () => any;
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
  sidebarSlotId: string;
  title: string;
  /**
   * topbar loading node
   */
  topbarSlotId: string;
  /**
   * load app defined widgets into this node
   */
  widgetSlotId: string;
}
export interface RootComponentProps {
  activeWhen: { path: string };
  domElement: HTMLElement;
  events: any;
  getMenuItems: () => any;
  globalChannel: any;
  i18n: any;
  i18nConfig: any;
  isMobile: boolean;
  layout: LayoutConfig;
  logger: any;
  mountParcel: () => void;
  name: string;
  rootNodeId: string;
  sdkModules: {
    [key: string]: { [key: string]: any };
  };
  singleSpa: any;
  unmountSelf: () => void;
}

export enum LogoTypeSource {
  ICON = 'icon',
  String = 'string',
  IPFS = 'ipfs',
  AVATAR = 'avatar',
}
export enum EthProviders {
  None = 1,
  Web3Injected,
  WalletConnect,
}
export const AppLoader = AppLoaderTypes;
