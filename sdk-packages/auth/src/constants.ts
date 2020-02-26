import { IAkashaModuleServices } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { buildServicePath } from '@akashaproject/sdk-core/lib/utils';

export const AUTH_SERVICE = 'AUTH_SERVICE';
export const AUTH_ENDPOINT = 'AUTH_ENDPOINT';
export const AUTH_MESSAGE = 'authenticate on ethereum.world';

export const moduleName = 'auth';
const servicePath = buildServicePath(moduleName);

const services: IAkashaModuleServices = {
  [AUTH_SERVICE]: servicePath(AUTH_SERVICE),
};

export default services;
