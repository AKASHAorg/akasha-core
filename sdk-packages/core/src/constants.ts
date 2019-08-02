import { AkashaServicePath } from './IAkashaModule';

export const SETTINGS_SERVICE = 'SETTINGS_SERVICE';
export const moduleName = 'core';

const getLocalServicePath = (serviceName: string): AkashaServicePath => [moduleName, serviceName];

interface IServices {
  [serviceName: string]: AkashaServicePath;
}

export const services: IServices = {
  [SETTINGS_SERVICE]: getLocalServicePath(SETTINGS_SERVICE)
};
