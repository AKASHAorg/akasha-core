import coreServices from '@akashaproject/sdk-core/lib/constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { EthProviders } from '@akashaproject/ui-awf-typings';
import { ethers } from 'ethers';
import commonServices, { CACHE_SERVICE, WEB3_SERVICE } from './constants';
import getProvider from './web3.methods/provider';

const service: AkashaService = (invoke, log) => {
  const regen = async provider => {
    const cacheService = invoke(commonServices[CACHE_SERVICE]);
    log.info('returning a new ethers provider instance');
    const { getSettings } = invoke(coreServices.SETTINGS_SERVICE);
    const stash = await cacheService.getStash();
    try {
      const web3Provider = await getProvider(getSettings, provider);
      stash.set(commonServices[WEB3_SERVICE], web3Provider);
    } catch (e) {
      throw e;
    }
    return stash.get(commonServices[WEB3_SERVICE]);
  };

  // to force regen() on the next web3 call
  const destroy = async () => {
    const stash: any = await invoke(commonServices[CACHE_SERVICE]).getStash();
    stash.remove(commonServices[WEB3_SERVICE]);
  };

  // fetch an existing instance or create web3Provider
  const web3 = async (provider?: EthProviders) => {
    const stash: any = await invoke(commonServices[CACHE_SERVICE]).getStash();
    const web3Provider = stash.get(commonServices[WEB3_SERVICE]);
    if (!web3Provider) {
      return await regen(provider || EthProviders.Web3Injected);
    }
    log.info('reusing an existing ethers provider instance');
    return web3Provider;
  };
  // getter/alias for web3
  const getWeb3Instance = async (provider?: EthProviders) => {
    return await web3(provider);
  };

  // wrapper
  const wallet = async () => ethers.Wallet;

  const getContractFactory = async () => ethers.ContractFactory;

  return { regen, destroy, wallet, web3, getWeb3Instance, getContractFactory };
};

export default { service, name: WEB3_SERVICE };
