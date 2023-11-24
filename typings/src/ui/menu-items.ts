import { ValueOf } from './type-utils';

type Sources = 'icon' | 'source' | 'string' | 'ipfs' | 'avatar';

export type LogoSourceType =
  | {
      type: Extract<Sources, 'icon'>;
      solidIcon?: boolean;
      value: React.ReactElement;
    }
  | {
      type: Exclude<Sources, 'icon'>;
      value: string;
    };

export enum LogoTypeSource {
  ICON = 'icon',
  String = 'string',
  IPFS = 'ipfs',
  AVATAR = 'avatar',
}

export interface IMenuItem {
  index?: number;
  label: string;
  route?: string;
  type?: MenuItemType;
  area?: ValueOf<MenuItemAreaType>[]; // area is optional because subroutes dont have an area to be mounted
  logo?: LogoSourceType;
  name?: string;
  subRoutes?: IMenuItem[];
}

export enum MenuItemType {
  Plugin = 'plugin',
  App = 'app',
  Internal = 'internal',
}

export enum MenuItemAreaType {
  AppArea = 'app-area', // body of sidebar
  UserAppArea = 'user-app-area', // user installed app area of sidebar
  UserWidgetArea = 'user-widget-area', // user installed widget area of sidebar
  QuickAccessArea = 'quick-access-area', // right of topbar
  BottomArea = 'bottom-area', // footer of sidebar
  SearchArea = 'search-area', // middle of topbar
  OtherArea = 'other-area', // not displayed
}
