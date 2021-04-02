import coreServices from '@akashaproject/sdk-core/lib/constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { EthProviders } from '@akashaproject/ui-awf-typings';
import { ethers } from 'ethers';
import commonServices, { CACHE_SERVICE, ETH_NETWORK, moduleName, WEB3_SERVICE } from './constants';
import getProvider from './web3.methods/provider';

const service: AkashaService = (invoke, log) => {
  const regen = async provider => {
    const cacheService = invoke(commonServices[CACHE_SERVICE]);
    log.info('returning a new ethers provider instance');
    const { getSettings } = invoke(coreServices.SETTINGS_SERVICE);
    const stash = await cacheService.getStash();
    try {
      const web3Provider = await getProvider(getSettings, provider, log);
      stash.set(commonServices[WEB3_SERVICE], web3Provider);
    } catch (e) {
      throw e;
    }
    return stash.get(commonServices[WEB3_SERVICE]);
  };

  // to force regen() on the next web3 call
  const destroy = async () => {
    const stash: any = await invoke(commonServices[CACHE_SERVICE]).getStash();
    const web3Instance = await web3();
    if (typeof web3Instance?.provider?.disconnect === 'function') {
      await web3Instance.provider.disconnect();
    }
    stash.remove(commonServices[WEB3_SERVICE]);
    return Promise.resolve();
  };

  // fetch an existing instance or create web3Provider
  const web3 = async (provider?: EthProviders) => {
    const stash: any = await invoke(commonServices[CACHE_SERVICE]).getStash();
    const web3Provider = stash.get(commonServices[WEB3_SERVICE]);
    if (!web3Provider) {
      return await regen(provider || EthProviders.FallbackProvider);
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
  // this was not consistent across web3 providers
  const signMessage = async (message: string) => {
    const normalizedMessage = ethers.utils.toUtf8Bytes(message);
    const web3Instance = await getWeb3Instance();
    const signer = await web3Instance.getSigner();
    const address = await signer.getAddress();
    return web3Instance.send('personal_sign', [
      ethers.utils.hexlify(normalizedMessage),
      address.toLowerCase(),
    ]);
  };

  const getAddress = async () => {
    const web3Instance = await getWeb3Instance();
    const signer = await web3Instance.getSigner();
    return signer.getAddress();
  };
  const checkCurrentNetwork = async () => {
    const web3Instance = await getWeb3Instance();
    const { getSettings } = invoke(coreServices.SETTINGS_SERVICE);
    const network = await web3Instance.detectNetwork();
    const moduleSettings = await getSettings(moduleName);
    const networkName = moduleSettings[ETH_NETWORK];
    if (network?.name !== networkName) {
      throw new Error(`Please change the ethereum network to ${networkName}!`);
    }
    log.info(`currently on network: ${network.name}`);
  };
  return {
    regen,
    destroy,
    wallet,
    web3,
    getWeb3Instance,
    getContractFactory,
    signMessage,
    getAddress,
    checkCurrentNetwork,
  };
};

export default { service, name: WEB3_SERVICE };
