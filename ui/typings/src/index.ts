import * as AppLoaderTypes from './app-loader';
import i18n from 'i18next';
export interface IAkashaError {
  errorKey: string;
  error: Error;
  critical: boolean;
}

export interface LogoSourceType {
  type: LogoTypeSource;
  value: string;
}

export interface RootComponentProps {
  activeWhen?: { path: string };
  domElement: HTMLElement;
  uiEvents: any;
  i18n?: typeof i18n;
  getMenuItems?: () => any;
  globalChannel: any;
  isMobile: boolean;
  layoutConfig: Omit<AppLoaderTypes.LayoutConfig, 'loadingFn' | 'mountsIn' | 'name' | 'title'>;
  logger: any;
  mountParcel: (parcel: unknown, config?: unknown) => unknown;
  name: string;
  sdkModules: {
    [key: string]: any;
  };
  singleSpa: any;
  installIntegration?: (name: string) => void;
  uninstallIntegration?: (name: string) => void;
  navigateToModal: (opts: AppLoaderTypes.ModalNavigationOptions) => void;
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
  FallbackProvider,
}

export enum LEGAL_DOCS {
  TERMS_OF_USE = 'TermsOfUse',
  TERMS_OF_SERVICE = 'TermsOfService',
  PRIVACY_POLICY = 'PrivacyPolicy',
  CODE_OF_CONDUCT = 'CodeOfConduct',
  APP_GUIDE = 'AppGuide',
}
