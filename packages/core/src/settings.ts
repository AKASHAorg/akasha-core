export interface ISettings {
  moduleName: string,
  values: [string, any][]
}
const init = () => {
  const settingsSymbol = Symbol('setting$');

  // global container for settings
  const coreSettings = {
    [settingsSymbol]: new Map()
  };

  const getSettings = function (moduleName: ISettings['moduleName']) {
    return coreSettings[settingsSymbol].get(moduleName);
  };

  const setSettings = function (settings: ISettings): void {
    coreSettings[settingsSymbol].set(settings.moduleName, settings.values);
  };
  return { getSettings, setSettings }
};
export default init
