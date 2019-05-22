export interface Settings {
  moduleName: string,
  values: Array<string>[]
}
const init = () => {
  const settingsSymbol = Symbol('setting$');
  const coreSettings = {
    [settingsSymbol]: new Map()
  };

  const getSettings = function (moduleName: Settings['moduleName']) {
    return coreSettings[settingsSymbol].get(moduleName);
  };

  const setSettings = function (settings: Settings): void {
    coreSettings[settingsSymbol].set(settings.moduleName, settings.values);
  };
  return { getSettings, setSettings }
};
export default init
