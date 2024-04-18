import { EthProviders } from '../sdk';

type Login = {
  provider: EthProviders;
  checkRegistered?: boolean;
};

export type GetUserInfo = {
  profileDid: string;
};

/**
 * Interface defining the state of a user store
 */
export interface IUserState<T> {
  authenticatedDID: string;
  authenticatedProfile: T;
  authenticatedProfileError: Error;
  authenticationError: Error;
  isAuthenticating: boolean;
  //User profile info
  info: Record<string, T>;
  isLoadingInfo: boolean;
  infoError: Error;
}

/**
 * Interface defining method for fetching profile info inside a profile plugin
 */

export interface IGetProfileInfo<T> {
  getProfileInfo(params: GetUserInfo): Promise<{ data: T; error: string }>;
}

/**
 * Interface defining a user store
 */

export interface IUserStore<T> {
  login({ provider, checkRegistered }: Login): void;
  logout(): void;
  getUserInfo({ profileDid }: GetUserInfo): void;
  restoreSession(): void;
  subscribe(listener: () => void): () => void;
  getSnapshot(): IUserState<T>;
}

/**
 * Interface defining a profile plugin
 */
export interface IProfilePlugin<T> {
  get userStore(): IUserStore<T>;
  getProfileInfo: IGetProfileInfo<T>['getProfileInfo'];
}
