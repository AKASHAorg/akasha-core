import { IAkashaModuleServices } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { buildServicePath } from '@akashaproject/sdk-core/lib/utils';

export const ENS_SERVICE = 'ENS_SERVICE';

export const ENS_ADDRESS = '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e';
export const RESOLVER_ADDRESS = '0xf6305c19e814d2a75429Fd637d01F7ee0E77d615';
export const REGISTRAR_ADDRESS = 'REGISTRAR_ADDRESS';

export const REVERSE_STRING = '0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2';

export const moduleName = 'registry';
const servicePath = buildServicePath(moduleName);

const services: IAkashaModuleServices = {
  [ENS_SERVICE]: servicePath(ENS_SERVICE),
};

export default services;
