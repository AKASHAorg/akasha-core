import { IAkashaModuleServices } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { buildServicePath } from '@akashaproject/sdk-core/lib/utils';

export const AUTH_SERVICE = 'AUTH_SERVICE';
export const AUTH_ENDPOINT = 'AUTH_ENDPOINT';
export const AUTH_MESSAGE = 'generate secret phrase for ethereum.world';
export const AUTH_CACHE = 'auth';

export const ethAddressCache = 'ethAddress';
export const tokenCache = 'token';

export const moduleName = 'auth';
const servicePath = buildServicePath(moduleName);

export const authStatus = {
  isNewUser: false,
};

const services: IAkashaModuleServices = {
  [AUTH_SERVICE]: servicePath(AUTH_SERVICE),
};

export default services;
