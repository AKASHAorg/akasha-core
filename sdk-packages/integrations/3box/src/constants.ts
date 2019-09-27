import { IAkashaModuleServices } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { buildServicePath } from '@akashaproject/sdk-core/lib/utils';

export const BOX_SERVICE = 'BOX_SERVICE';
export const BOX_INSTANCE = 'BOX_INSTANCE';
export const BOX_PROFILE = 'BOX_PROFILE';

export const moduleName = '3box';

const servicePath = buildServicePath(moduleName);
const services: IAkashaModuleServices = Object.freeze({
  [BOX_SERVICE]: servicePath(BOX_SERVICE),
});
export default services;
