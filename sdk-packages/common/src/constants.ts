import { IAkashaModuleServices } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { buildServicePath } from '@akashaproject/sdk-core/lib/utils';

import { LEGAL_DOCS } from '@akashaproject/ui-awf-typings';

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

export const LEGAL_DOCS_SOURCE = {
  [LEGAL_DOCS.TERMS_OF_USE]: 'bafkreie3pa22hfttuuier6rp6sm7nngfc5jgfjzre7wc5a2ww7z375fhwm',
  [LEGAL_DOCS.TERMS_OF_SERVICE]: 'bafkreib5jg73c6bmbzkrokpusraiwwycnkypol3xh3uadsu7hhzefp6g2e',
  [LEGAL_DOCS.PRIVACY_POLICY]: 'bafkreifjtbzuxwhhmmpq7c3xn74wbzog3robhsjyauvwtshh6zst2axlhm',
  [LEGAL_DOCS.CODE_OF_CONDUCT]: 'bafkreie6ygpcmpckoxnb6rip62nxztntwu5k2oqmwfvxyubfppwimhype4',
  [LEGAL_DOCS.APP_GUIDE]: 'bafkreidpkbwzpxupnnty4bua5w4n7ddiyugb2ermb2htkxczrw7okan3nu',
};
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
