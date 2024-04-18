import { EthProviders } from '../sdk';

type Login = {
  provider: EthProviders;
  checkRegistered?: boolean;
};

export interface IGetUserInfo {
  profileDid: string;
}

/**
 * Interface defining the state for a user store
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
 * Interface defining a user store
 */

export interface IUserStore<T> {
  login({ provider, checkRegistered }: Login): void;
  logout(): void;
  getUserInfo({ profileDid }: IGetUserInfo): void;
  restoreSession(): void;
  subscribe(listener: () => void): () => void;
  getSnapshot(): IUserState<T>;
}
