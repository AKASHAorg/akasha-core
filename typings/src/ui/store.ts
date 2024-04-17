import { EthProviders } from '../sdk';

type LoginInput = {
  provider: EthProviders;
  checkRegistered?: boolean;
};

export interface IUserState {
  authenticatedDid: string;
  authenticatedProfile: unknown;
  authenticatedProfileError: Error;
  authenticationError: Error;
  isAuthenticating: boolean;
  info: Map<string, unknown>;
  isLoadingInfo: boolean;
  infoError: Error;
}

export interface IUserStore {
  login({ provider, checkRegistered }: LoginInput): void;
  logout(): void;
  getUserInfo(profileDid: string, appName?: string): void;
  restoreSession(): void;
  subscribe(listener: () => void): () => void;
  getSnapshot(): IUserState;
}
