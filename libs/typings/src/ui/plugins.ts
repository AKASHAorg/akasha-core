import { IUserStore } from './store';

export interface IPluginsMap {
  [namespace: string]: any;
}

export interface PluginConf {
  [namespace: string]: {
    [key: string]: unknown;
  };
}

/**
 * Type defining param of a function which fetches profile info
 **/
export type GetUserInfo = {
  profileDID: string;
};

/**
 * Interface defining method for fetching profile info inside a profile plugin
 */

export interface IGetProfileInfo<T> {
  getProfileInfo(params: GetUserInfo): Promise<{ data: T; error: string }>;
}

/**
 * Interface defining a profile plugin
 */
export interface IProfilePlugin<T> {
  get userStore(): IUserStore<T>;
  getProfileInfo: IGetProfileInfo<T>['getProfileInfo'];
}
