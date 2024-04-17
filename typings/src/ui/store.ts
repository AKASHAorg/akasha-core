import { EthProviders } from '../sdk';

type LoginInput = {
  provider: EthProviders;
  checkRegistered?: boolean;
};

export interface IUserState {
  authenticatedDid: string;
  isAuthenticating: boolean;
  authenticationError: Error;
  info: unknown;
  isLoadingInfo: boolean;
}

export interface IUserStore {
  login({ provider, checkRegistered }: LoginInput): void;
  logout(): void;
  getUserInfo(profileDid: string, appName?: string): void;
  restoreSession(): void;
  subscribe(listener: () => void): () => void;
  getSnapshot(): IUserState;
}
