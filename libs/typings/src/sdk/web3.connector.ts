import { z } from 'zod';
export enum EthProviders {
  None = 1,
  Web3Injected,
  WalletConnect,
  FallbackProvider,
  Torus,
}
export const EthProvidersSchema = z.nativeEnum(EthProviders);
