import { IAkashaModuleServices } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { buildServicePath } from '@akashaproject/sdk-core/lib/utils';

export const ENS_SERVICE = 'ENS_SERVICE';

export const RESOLVER_ADDRESS = 'RESOLVER_ADDRESS';
export const REGISTRAR_ADDRESS = 'REGISTRAR_ADDRESS';

export const REVERSE_STRING = '0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2';

export const moduleName = 'registry';
const servicePath = buildServicePath(moduleName);

const services: IAkashaModuleServices = {
  [ENS_SERVICE]: servicePath(ENS_SERVICE),
};

export default services;
