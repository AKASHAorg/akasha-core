import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { SETTINGS_SERVICE } from './constants';
import { AkashaService } from '../lib/IAkashaModule';

export type ICommonSettings = [string, string][];

export interface ICoreSettings {
  moduleName: string,
  values: [string, any][]
}

export default function registerService (di: DIContainer): AkashaService {
  const service = () => {
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
    return () => ({ getSettings, setSettings });
  };

  return { name: SETTINGS_SERVICE, service };
}

