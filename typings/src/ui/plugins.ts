import { GetUserInfo, IUserStore } from './store';

export interface IPluginsMap {
  [namespace: string]: any;
}

export interface PluginConf {
  [namespace: string]: {
    [key: string]: unknown;
  };
}

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
