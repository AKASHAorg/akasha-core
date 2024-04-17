import { EthProviders } from '../sdk';

type LoginInput = {
  provider: EthProviders;
  checkRegistered?: boolean;
};

export interface IGetUserInfo {
  profileDid: string;
}

export interface IUserState<T> {
  authenticatedDID: string;
  authenticatedProfile: T;
  authenticatedProfileError: Error;
  authenticationError: Error;
  isAuthenticating: boolean;
  info: Record<string, T>;
  isLoadingInfo: boolean;
  infoError: Error;
}

export interface IUserStore<T> {
  login({ provider, checkRegistered }: LoginInput): void;
  logout(): void;
  getUserInfo({ profileDid }: IGetUserInfo): void;
  restoreSession(): void;
  subscribe(listener: () => void): () => void;
  getSnapshot(): IUserState<T>;
}
