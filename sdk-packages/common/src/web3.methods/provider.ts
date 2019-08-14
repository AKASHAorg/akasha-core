import { ethers } from 'ethers';
import { ETH_NETWORK, moduleName, WEB3_PROVIDER } from '../constants';

export default function getProvider(getSettings: CallableFunction) {
  const moduleSettings = getSettings(moduleName);

  const networkSettings = moduleSettings.find(
    serviceSettings => serviceSettings[0] === ETH_NETWORK,
  );
  // check if there is already a provider set(ex: Metamask)
  const existingProvider = moduleSettings.find(
    serviceSettings => serviceSettings[0] === WEB3_PROVIDER,
  );

  if (existingProvider) {
    return new ethers.providers.Web3Provider(existingProvider[1]);
  }

  if (!networkSettings) {
    throw new Error(`Must provide an ${ETH_NETWORK} value.`);
  }
  const network = networkSettings[1];
  return ethers.getDefaultProvider(String(network));
}
