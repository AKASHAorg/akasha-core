import runtime from '@akashaproject/sdk-runtime';
import bootstrapSettings from './settings';
import { SETTINGS_SERVICE } from './constants';

// create the dependency injection container and the cache list handler
export default function bootstrapFactory() {
  const di = new runtime.DIContainer();
  const stash = new runtime.Stash();
  const settings = bootstrapSettings();

  const settingsService = function (){
    return settings;
  };
  // register the settings service
  di.register(SETTINGS_SERVICE, settingsService);
  return { di, stash }
}
