import { IAkashaModuleServices } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { buildServicePath } from '@akashaproject/sdk-core/lib/utils';

export const DB_SERVICE = 'DB_SERVICE';
export const DB_SYNC_ENDPOINT = 'db_sync_endpoint';
export const DB_PASSWORD = 'db_password';
export const DB_NAME = 'db_name';

export const moduleName = 'db';

const servicePath = buildServicePath(moduleName);

const services: IAkashaModuleServices = Object.freeze({
  [DB_SERVICE]: servicePath(DB_SERVICE),
});

export default services;
