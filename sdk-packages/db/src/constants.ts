import { IAkashaModuleServices } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { buildServicePath } from '@akashaproject/sdk-core/lib/utils';

export const DB_SERVICE = 'DB_SERVICE';
// just for testing purpose
export const DB_SYNC_ENDPOINT = 'http://localhost:3000/db';

export const moduleName = 'db';

const servicePath = buildServicePath(moduleName);

const services: IAkashaModuleServices = Object.freeze({
  [DB_SERVICE]: servicePath(DB_SERVICE),
});

export default services;
