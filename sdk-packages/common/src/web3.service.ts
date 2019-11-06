import coreServices from '@akashaproject/sdk-core/lib/constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { ethers } from 'ethers';
import { EthProviders, WEB3_SERVICE } from './constants';
import commonServices, { CACHE_SERVICE } from './constants';
import getProvider from './web3.methods/provider';

const service: AkashaService = (invoke, log) => {
  const regen = async provider => {
    const cacheService = invoke(commonServices[CACHE_SERVICE]);
    log.info('returning a new ethers provider instance');
    const { getSettings } = invoke(coreServices.SETTINGS_SERVICE);
    const web3Provider = await getProvider(getSettings, provider);
    const stash = await cacheService.getStash();
    stash.set(commonServices[WEB3_SERVICE], web3Provider);
    return web3Provider;
  };

  // to force regen() on the next web3 call
  const destroy = async () => {
    const stash: any = await invoke(commonServices[CACHE_SERVICE]).getStash();
    stash.remove(commonServices[WEB3_SERVICE]);
  };

  // fetch an existing instance or create web3Provider
  const web3 = async (provider: EthProviders) => {
    const stash: any = await invoke(commonServices[CACHE_SERVICE]).getStash();
    const web3Provider = stash.get(commonServices[WEB3_SERVICE]);
    if (!web3Provider) {
      return await regen(provider);
    }
    log.info('reusing an existing ethers provider instance');
    return web3Provider;
  };

  const getWeb3Instance = async () => {
    const stash: any = await invoke(commonServices[CACHE_SERVICE]).getStash();
    return stash.get(commonServices[WEB3_SERVICE]);
  };

  // wrapper
  const wallet = async () => ethers.Wallet;

  return { regen, destroy, wallet, web3, getWeb3Instance };
};

export default { name: WEB3_SERVICE, service };
