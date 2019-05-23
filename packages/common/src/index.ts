import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { SETTINGS_SERVICE } from '@akashaproject/sdk-core/lib/constants';
import { moduleName } from './constants';
import settings from './settings';
import { ISettings } from '@akashaproject/sdk-core/lib/settings';


interface AkashaModule {
  init(di: DIContainer): void
}

class CommonsModule implements AkashaModule {
  init (di: DIContainer): void {
    const settingsObj: ISettings = {moduleName, values: settings};
    di.getService(SETTINGS_SERVICE).setSettings(settingsObj);
  }
}
