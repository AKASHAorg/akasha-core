import { IAkashaModuleServices } from './IAkashaModule';
import { buildServicePath } from './utils';

export const SETTINGS_SERVICE = 'SETTINGS_SERVICE';
export const moduleName = 'core';

const servicePath = buildServicePath(moduleName);

const services: IAkashaModuleServices = Object.freeze({
  [SETTINGS_SERVICE]: servicePath(SETTINGS_SERVICE)
});

export default services;
