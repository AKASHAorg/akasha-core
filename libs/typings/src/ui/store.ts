import { EthProviders } from '../sdk';

/**
 * Type defining params of login function
 * @internal
 */
type Login = {
  provider: EthProviders;
  checkRegistered?: boolean;
};

/**
 * Interface defining the state of a user object
 */
export interface IUserState<T> {
  authenticatedDID: string;
  authenticatedProfile: T;
  authenticatedProfileError: Error | null;
  authenticationError: Error | null;
  isAuthenticating: boolean;
}

/**
 * Interface defining a user state store
 */
export interface IUserStore<T> {
  login({ provider, checkRegistered }: Login): void;
  logout(): void;
  restoreSession(): void;
  subscribe(listener: () => void): () => void;
  getSnapshot(): IUserState<T>;
}
