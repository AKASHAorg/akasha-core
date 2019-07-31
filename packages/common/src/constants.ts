import { AkashaServicePath, AkashaModuleServices } from '@akashaproject/sdk-core/lib/IAkashaModule';

export const VALIDATOR_SERVICE_FACTORY = 'VALIDATOR_SERVICE_FACTORY';
export const CACHE_PROVIDER_FACTORY = 'CACHE_PROVIDER_FACTORY';
export const WEB3_SERVICE_PROVIDER = 'WEB3_SERVICE_PROVIDER';
export const WEB3_EXISTING_PROVIDER = 'WEB3_EXISTING_PROVIDER';
export const WEB3_WALLET = 'WEB3_WALLET';
export const WEB3_UTILS = 'WEB3_UTILS';
export const IPFS_SERVICE = 'IPFS_SERVICE';

export const moduleName = 'commons';

const getLocalServicePath = (serviceName: string): AkashaServicePath => [moduleName, serviceName];
// for service consumers
export const services: AkashaModuleServices = {
  [VALIDATOR_SERVICE_FACTORY]: getLocalServicePath(VALIDATOR_SERVICE_FACTORY),
  [CACHE_PROVIDER_FACTORY]: getLocalServicePath(CACHE_PROVIDER_FACTORY),
  [WEB3_SERVICE_PROVIDER]: getLocalServicePath(WEB3_SERVICE_PROVIDER),
  [WEB3_EXISTING_PROVIDER]: getLocalServicePath(WEB3_EXISTING_PROVIDER),
  [WEB3_WALLET]: getLocalServicePath(WEB3_WALLET),
  [WEB3_UTILS]: getLocalServicePath(WEB3_UTILS),
  [IPFS_SERVICE]: getLocalServicePath(IPFS_SERVICE),
};
