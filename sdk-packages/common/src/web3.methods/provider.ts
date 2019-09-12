import { ethers } from 'ethers';
import { ETH_NETWORK, moduleName, WEB3_PROVIDER } from '../constants';

export default function getProvider(getSettings: CallableFunction) {
  const moduleSettings = getSettings(moduleName);

  const networkSettings = moduleSettings.hasOwnProperty(ETH_NETWORK);
  // check if there is already a provider set(ex: Metamask)
  const existingProvider = moduleSettings.hasOwnProperty(WEB3_PROVIDER);

  if (existingProvider) {
    return new ethers.providers.Web3Provider(moduleSettings[WEB3_PROVIDER]);
  }

  if (!networkSettings) {
    throw new Error(`Must provide an ${ETH_NETWORK} value.`);
  }
  const network = moduleSettings[ETH_NETWORK];
  return ethers.getDefaultProvider(String(network));
}
