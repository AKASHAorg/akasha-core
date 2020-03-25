import { IAkashaModuleServices } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { buildServicePath } from '@akashaproject/sdk-core/lib/utils';

export const PROFILE_STORE = 'PROFILE_STORE';
export const PROFILE_FETCH = 'PROFILE_FETCH';

export const moduleName = 'commons';
const servicePath = buildServicePath(moduleName);

const services: IAkashaModuleServices = {
  [PROFILE_STORE]: servicePath(PROFILE_STORE),
  [PROFILE_FETCH]: servicePath(PROFILE_FETCH),
};

export default services;
