import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { SETTINGS_SERVICE } from './constants';
import { IAkashaService } from './IAkashaModule';

export type ICommonSettings = Array<[string, string]>;

export interface ICoreSettings {
  moduleName: string;
  values: Array<[string, any]>;
}

export default function registerService(di: DIContainer): IAkashaService {
  const service = () => {
    const settingsSymbol = Symbol('setting$');

    // global container for settings
    const coreSettings = {
      [settingsSymbol]: new Map()
    };

    const getSettings = (moduleName: ICoreSettings['moduleName']) => {
      return coreSettings[settingsSymbol].get(moduleName);
    };

    const setSettings = (settings: ICoreSettings): void => {
      coreSettings[settingsSymbol].set(settings.moduleName, settings.values);
    };
    return () => ({ getSettings, setSettings });
  };

  return { name: SETTINGS_SERVICE, service };
}
