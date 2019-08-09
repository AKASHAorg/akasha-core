import coreServices from '@akashaproject/sdk-core/lib/constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import {
  createServiceMethod,
  registerServiceMethods,
  toNamedService
} from '@akashaproject/sdk-core/lib/utils';
import { ethers } from 'ethers';
import { WEB3_SERVICE } from './constants';
import getProvider from './web3.methods/provider';

const service: AkashaService = invoke => {
  let web3Provider;

  const regen = () => {
    const { getSettings } = invoke(coreServices.SETTINGS_SERVICE);
    web3Provider = getProvider(getSettings);
    return web3Provider;
  };

  // to force regen() on the next web3 call
  const destroy = () => {
    web3Provider = null;
  };

  // fetch an existing instance or create web3Provider
  const web3 = () => {
    if (!web3Provider) {
      return regen();
    }
    return web3Provider;
  };

  // wrapper
  const wallet = createServiceMethod(ethers.Wallet);

  return registerServiceMethods({ regen, destroy, wallet, web3 });
};

export default toNamedService(WEB3_SERVICE, service);
