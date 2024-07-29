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
 * Interface defining the state of an authentication object
 */
export interface IAuthenticationState<T> {
  authenticatedDID: string;
  authenticatedProfile: T;
  authenticatedProfileError: Error | null;
  authenticationError: Error | null;
  isAuthenticating: boolean;
}

/**
 * Interface defining authentication state store
 */
export interface IAuthenticationStore<T> {
  login({ provider, checkRegistered }: Login): void;
  logout(): void;
  restoreSession(): void;
  subscribe(listener: () => void): () => void;
  getSnapshot(): IAuthenticationState<T>;
}
