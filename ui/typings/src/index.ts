import * as AppLoaderTypes from './app-loader';

export interface IAkashaError {
  errorKey: string;
  error: Error;
  critical: boolean;
}

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
  mountParcel: (parcel: any, config?: any) => any;
  name: string;
  rootNodeId: string;
  sdkModules: {
    [key: string]: { [key: string]: any };
  };
  singleSpa: any;
  unmountSelf: () => void;
  rxjsOperators: any;
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
  FallbackProvider,
}
export const AppLoader = AppLoaderTypes;

export enum LEGAL_DOCS {
  TERMS_OF_USE = 'TermsOfUse',
  TERMS_OF_SERVICE = 'TermsOfService',
  PRIVACY_POLICY = 'PrivacyPolicy',
  CODE_OF_CONDUCT = 'CodeOfConduct',
  APP_GUIDE = 'AppGuide',
}
