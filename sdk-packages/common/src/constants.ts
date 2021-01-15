import { IAkashaModuleServices } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { buildServicePath } from '@akashaproject/sdk-core/lib/utils';

export const VALIDATOR_SERVICE = 'VALIDATOR_SERVICE';
export const CACHE_SERVICE = 'CACHE_SERVICE';
export const WEB3_SERVICE = 'WEB3_SERVICE';
export const WEB3_WALLET_SERVICE = 'WEB3_WALLET_SERVICE';
export const WEB3_UTILS_SERVICE = 'WEB3_UTILS_SERVICE';
export const IPFS_SERVICE = 'IPFS_SERVICE';
export const IMAGE_UTILS_SERVICE = 'IMAGE_UTILS_SERVICE';

// ethereum chain id
export const ETH_NETWORK = 'eth_network';
// used for displaying images
export const IPFS_GATEWAY = 'ipfs_gateway';
// value to check when the web3 connector should connect to the existing web3 provider(like Metamask)
export const WEB3_PROVIDER = 'WEB3_PROVIDER';

export const moduleName = 'commons';
const servicePath = buildServicePath(moduleName);

// for service consumers
const services: IAkashaModuleServices = {
  [VALIDATOR_SERVICE]: servicePath(VALIDATOR_SERVICE),
  [CACHE_SERVICE]: servicePath(CACHE_SERVICE),
  [WEB3_SERVICE]: servicePath(WEB3_SERVICE),
  [WEB3_UTILS_SERVICE]: servicePath(WEB3_UTILS_SERVICE),
  [IPFS_SERVICE]: servicePath(IPFS_SERVICE),
  [IMAGE_UTILS_SERVICE]: servicePath(IMAGE_UTILS_SERVICE),
};
export default services;
