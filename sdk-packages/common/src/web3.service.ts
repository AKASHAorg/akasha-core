import coreServices from '@akashaproject/sdk-core/lib/constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { registerServiceMethods, toNamedService } from '@akashaproject/sdk-core/lib/utils';
import { ethers } from 'ethers';
import { ETH_NETWORK, moduleName, WEB3_PROVIDER, WEB3_SERVICE } from './constants';

const service: AkashaService = invoke => {
  let web3Provider;
  const regen = () => {
    const { getSettings } = invoke(coreServices.SETTINGS_SERVICE);
    const moduleSettings = getSettings(moduleName);
    const networkSettings = moduleSettings.find(
      serviceSettings => serviceSettings[0] === ETH_NETWORK
    );
    const existingProvider = moduleSettings.find(
      serviceSettings => serviceSettings[0] === WEB3_PROVIDER
    );
    if (existingProvider) {
      web3Provider = new ethers.providers.Web3Provider(existingProvider[1]);
    } else {
      if (!networkSettings) {
        throw new Error(`Must provide an ${ETH_NETWORK} value.`);
      }
      const network = networkSettings[1];
      web3Provider = ethers.getDefaultProvider(String(network));
    }
    return web3Provider;
  };

  const destroy = () => {
    web3Provider = null;
  };

  const web3 = () => {
    if (!web3Provider) {
      return regen();
    }
    return web3Provider;
  };

  const wallet = () => {
    return ethers.Wallet;
  };

  return registerServiceMethods({ regen, destroy, wallet, web3 });
};

export default toNamedService(WEB3_SERVICE, service);
