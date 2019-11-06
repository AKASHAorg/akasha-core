import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import { ETH_NETWORK, EthProviders, moduleName } from '../constants';
import { ConnectToInjected, ConnectToWalletConnect } from './provider-utils';

export default async function getProvider(
  getSettings: CallableFunction,
  provider: EthProviders = EthProviders.None,
) {
  let ethProvider;
  const moduleSettings = await getSettings(moduleName);

  const networkSettings = moduleSettings.hasOwnProperty(ETH_NETWORK);

  if (!networkSettings) {
    throw new Error(`Must provide an ${ETH_NETWORK} value.`);
  }

  const network = moduleSettings[ETH_NETWORK];
  if (provider === EthProviders.None) {
    return ethers.getDefaultProvider(network);
  }

  if (provider === EthProviders.Web3Injected) {
    ethProvider = await ConnectToInjected();
  }

  if (provider === EthProviders.WalletConnect) {
    ethProvider = await ConnectToWalletConnect(WalletConnectProvider, {
      infuraId: '21f3771ff3814c3db46dfcd216c9e672', // @Todo: change this on production
      network,
    });
  }

  return new ethers.providers.Web3Provider(ethProvider);
}
