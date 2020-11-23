import { IAkashaModuleServices } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { buildServicePath } from '@akashaproject/sdk-core/lib/utils';

export const ENTRY_SERVICE = 'ENTRY_SERVICE';
export const TAG_SERVICE = 'TAG_SERVICE';
export const COMMENT_SERVICE = 'COMMENT_SERVICE';

export const moduleName = 'posts';
const servicePath = buildServicePath(moduleName);

const services: IAkashaModuleServices = {
  [ENTRY_SERVICE]: servicePath(ENTRY_SERVICE),
  [TAG_SERVICE]: servicePath(TAG_SERVICE),
};

export default services;
