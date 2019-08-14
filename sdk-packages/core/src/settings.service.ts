import { SETTINGS_SERVICE } from './constants';
import { AkashaService, ICoreSettings } from './IAkashaModule';
import { registerServiceMethods, toNamedService } from './utils';

const service: AkashaService = () => {
  const settingsSymbol = Symbol('setting$');

  // global container for settings
  const coreSettings = {
    [settingsSymbol]: new Map(),
  };

  const getSettings = (moduleName: ICoreSettings['moduleName']) => {
    return coreSettings[settingsSymbol].get(moduleName);
  };

  const setSettings = (settings: ICoreSettings): void => {
    coreSettings[settingsSymbol].set(settings.moduleName, settings.values);
  };
  return registerServiceMethods({ getSettings, setSettings });
};

export default toNamedService(SETTINGS_SERVICE, service);
