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
