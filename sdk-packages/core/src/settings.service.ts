import { SETTINGS_SERVICE } from './constants';
import { AkashaService, ICoreSettings, IGeneralSettings } from './IAkashaModule';
import { fromEntries, toEntries } from './utils';

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

  const setServiceSettings = async (moduleName: string, options: IGeneralSettings) => {
    const currentSettings = await getSettings(moduleName);
    const newSettings = fromEntries(options);
    const patchedSettings = Object.assign({}, currentSettings, newSettings);
    await setSettings({ moduleName, values: toEntries(patchedSettings) });
  };

  return { getSettings, setSettings, setServiceSettings };
};

export default { name: SETTINGS_SERVICE, service: service };
