export type ICommonSettings = [string, string][];

export interface ICoreSettings {
  moduleName: string,
  values: [string, any][]
}

const init = () => {
  const settingsSymbol = Symbol('setting$');

  // global container for settings
  const coreSettings = {
    [settingsSymbol]: new Map()
  };

  const getSettings = function(moduleName: ICoreSettings['moduleName']) {
    return coreSettings[settingsSymbol].get(moduleName);
  };

  const setSettings = function(settings: ICoreSettings): void {
    coreSettings[settingsSymbol].set(settings.moduleName, settings.values);
  };
  return { getSettings, setSettings };
};
export default init;
