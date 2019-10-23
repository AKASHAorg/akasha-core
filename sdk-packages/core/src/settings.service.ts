import { SETTINGS_SERVICE } from './constants';
import { AkashaService, ICoreSettings } from './IAkashaModule';
import { fromEntries } from './utils';

const service: AkashaService = (invoke, log) => {
  const settingsSymbol = Symbol('setting$');

  // global container for settings
  const coreSettings = {
    [settingsSymbol]: new Map(),
  };

  const getSettings = async (moduleName: ICoreSettings['moduleName']) => {
    return fromEntries(coreSettings[settingsSymbol].get(moduleName));
  };

  const setSettings = async (settings: ICoreSettings): Promise<void> => {
    coreSettings[settingsSymbol].set(settings.moduleName, settings.values);
  };
  return { getSettings, setSettings };
};

export default { name: SETTINGS_SERVICE, service };
