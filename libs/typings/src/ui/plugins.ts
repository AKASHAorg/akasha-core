/**
 * Interface defining plugin configuration object
 */
export interface IPlugin {
  [namespace: string]: {
    [key: string]: any;
  };
}

/**
 * Type defining param of a function which fetches profile info
 * @internal
 **/
type UserInfoParams = {
  profileDID: string;
};

/**
 * Interface defining method for fetching profile info inside a profile plugin
 */
export interface IGetProfileInfo<T> {
  getProfileInfo(params: UserInfoParams): Promise<{ data: T; error: string }>;
}

/**
 * Interface defining a profile plugin
 */
export interface IProfilePlugin<T> {
  getProfileInfo: IGetProfileInfo<T>['getProfileInfo'];
}
