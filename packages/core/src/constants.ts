import { AkashaServicePath } from './IAkashaModule';

export const SETTINGS_SERVICE = 'SETTINGS_SERVICE';
export const moduleName = 'core';

const getLocalServicePath = (serviceName: string): AkashaServicePath => [moduleName, serviceName];

interface Services {
  [serviceName: string]: AkashaServicePath;
}

export const services: Services = {
  [SETTINGS_SERVICE]: getLocalServicePath(SETTINGS_SERVICE)
};
