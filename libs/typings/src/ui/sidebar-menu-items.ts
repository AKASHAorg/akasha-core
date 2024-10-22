import { ValueOf } from './type-utils';

/**
 * @internal
 * Type defining logo types
 **/

type LogoTypes = 'icon' | 'source' | 'string' | 'ipfs' | 'avatar';

/**
 * Type defining logo types and their corresponding value
 **/
export type LogoSourceType =
  | {
      type: Extract<LogoTypes, 'icon'>;
      value: React.ReactElement;
    }
  | {
      type: Exclude<LogoTypes, 'icon'>;
      value: string;
    };

/**
 * Enum defining logo types
 **/
export enum LogoTypeSource {
  ICON = 'icon',
  STRING = 'string',
  IPFS = 'ipfs',
  AVATAR = 'avatar',
}

/**
 * Interface defining sidebar menu items
 **/
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

/**
 * Enum defining menu item types
 **/
export enum MenuItemType {
  Plugin = 'plugin',
  App = 'app',
  Internal = 'internal',
}

/**
 * Enum defining an area where a menu item is loaded
 **/
export enum MenuItemAreaType {
  AppArea = 'app-area', // body of sidebar
  UserAppArea = 'user-app-area', // user installed app area of sidebar
  UserWidgetArea = 'user-widget-area', // user installed widget area of sidebar
  QuickAccessArea = 'quick-access-area', // right of topbar
  BottomArea = 'bottom-area', // footer of sidebar
  SearchArea = 'search-area', // middle of topbar
  OtherArea = 'other-area', // not displayed
}
