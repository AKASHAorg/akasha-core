import { EthProviders } from '../sdk';

type Login = {
  provider: EthProviders;
  checkRegistered?: boolean;
};

export type GetUserInfo = {
  profileDID: string;
};

/**
 * Interface defining the state of a user store
 */
export interface IUserState<T> {
  authenticatedDID: string;
  authenticatedProfile: T;
  authenticatedProfileError: Error | null;
  authenticationError: Error | null;
  isAuthenticating: boolean;
}

/**
 * Interface defining a user store
 */

export interface IUserStore<T> {
  login({ provider, checkRegistered }: Login): void;
  logout(): void;
  restoreSession(): void;
  subscribe(listener: () => void): () => void;
  getSnapshot(): IUserState<T>;
}
