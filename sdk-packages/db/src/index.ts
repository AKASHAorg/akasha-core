import coreServices from '@akashaproject/sdk-core/lib/constants';
import {
  IAkashaModule,
  IAkashaModuleServices,
  IAkashaNamedService,
  ICoreSettings,
} from '@akashaproject/sdk-core/lib/IAkashaModule';
import { callService } from '@akashaproject/sdk-core/lib/utils';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { moduleName } from './constants';
import dbService from './db.service';
import settings from './settings';

export class DBModule extends IAkashaModule {
  public availableServices(): IAkashaModuleServices {
    return undefined;
  }
  protected _name(): string {
    return moduleName;
  }

  protected _registerServices(di: DIContainer): IAkashaNamedService[] {
    return [dbService];
  }

  protected init(di: DIContainer): void {
    const settingsObj: ICoreSettings = { moduleName, values: settings };
    const { setSettings } = callService(di)(coreServices.SETTINGS_SERVICE);
    setSettings(settingsObj);
  }
}
export default function registerModule() {
  return new DBModule();
}
