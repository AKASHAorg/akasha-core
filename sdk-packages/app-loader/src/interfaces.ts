import { SDKdependency } from './index';

export interface II18nConfig {
  use: any[];
  loadNS?: string[];
  ns?: string;
}

export interface IPlugin {
  name: string;
  services?: any[];
  i18nConfig: II18nConfig;
  loadingFn: () => Promise<any>;
  activeWhen: {
    exact?: boolean;
    path: string;
  };
  title?: string;
  sdkModules?: SDKdependency[];
  logo?: string;
  menuItems?: { [p: string]: string };
}

export interface IWidget {
  name: string;
  i18nConfig?: II18nConfig;
  loadingFn: () => Promise<any>;
  pluginSlotId?: string;
  topbarSlotId?: string;
  sidebarSlotId?: string;
  services?: any[];
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
  logo?: string;
  subRoutes?: IMenuItem[];
}

export interface IMenuList {
  nextIndex: number;
  items: IMenuItem[];
}
