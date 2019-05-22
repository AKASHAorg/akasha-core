import runtime from '@akashaproject/sdk-runtime';
import bootstrapSettings from './settings';
import { SETTINGS } from './constants';

// create the dependency injection container and the cache list handler
export default function bootstrapFactory() {
  const di = new runtime.DIContainer();
  const stash = new runtime.Stash();
  const settings = bootstrapSettings();

  const settingsService = function (){
    return settings;
  };
  // register the settings service
  di.register(SETTINGS, settingsService);
  return { di, stash }
}
