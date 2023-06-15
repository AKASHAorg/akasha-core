import { EthProviders } from '@akashaorg/typings/sdk/web3.connector';

export const WELCOME = 'Welcome';
export const CONNECT = 'Connect';
export const METAMASK = 'Metamask';
export const WALLETCONNECT = 'WalletConnect';

export default {
  [WELCOME]: '/welcome',
  [CONNECT]: '/provider',
  [EthProviders.Web3Injected]: '/injected',
  [EthProviders.WalletConnect]: '/wallet-connect',
};
