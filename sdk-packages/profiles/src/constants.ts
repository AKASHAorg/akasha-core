import { IAkashaModuleServices } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { buildServicePath } from '@akashaproject/sdk-core/lib/utils';

export const PROFILE_STORE = 'PROFILE_STORE';

export const moduleName = 'profiles';
const servicePath = buildServicePath(moduleName);

const services: IAkashaModuleServices = {
  [PROFILE_STORE]: servicePath(PROFILE_STORE),
};

export default services;
