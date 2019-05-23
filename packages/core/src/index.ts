import runtime from '@akashaproject/sdk-runtime';
import Validator from '@akashaproject/jsonschema-web3';
import bootstrapSettings from './settings';
import { CACHE_PROVIDER_FACTORY, SETTINGS_SERVICE, VALIDATOR_SERVICE_FACTORY } from './constants';

//
const validatorFactory = function () {
  return new Validator();
};

// service for creating objects of cache container
const cacheProviderFactory = function () {
  return new runtime.Stash();
};
// create the dependency injection container and the cache list handler
export default function bootstrapFactory() {
  const di = new runtime.DIContainer();
  const settings = bootstrapSettings();

  const settingsService = function (){
    return settings;
  };
  // register the settings service
  di.register(SETTINGS_SERVICE, settingsService);

  // register the service for creating validation rule instances
  di.register(VALIDATOR_SERVICE_FACTORY, validatorFactory);

  // register the service for creating cache containers
  di.register(CACHE_PROVIDER_FACTORY, cacheProviderFactory);

  // these instances are required to instantiate the packages used for building the akasha-sdk
  return di;
}
