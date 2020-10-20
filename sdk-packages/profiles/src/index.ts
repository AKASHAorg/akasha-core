import coreServices from '@akashaproject/sdk-core/lib/constants';
import {
  IAkashaModule,
  IAkashaModuleServices,
  IAkashaNamedService,
  ICoreSettings,
} from '@akashaproject/sdk-core/lib/IAkashaModule';
import { callService } from '@akashaproject/sdk-core/lib/utils';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import services, { moduleName, PROFILE_LEGACY, PROFILE_STORE } from './constants';
import storeService from './profile.store.service';
import legacyProfileService from './profile.legacy.service';
import settings from './settings';

export class ProfilesModule extends IAkashaModule {
  protected _name(): string {
    return moduleName;
  }

  protected _registerServices(di: DIContainer): IAkashaNamedService[] {
    return [storeService, legacyProfileService];
  }

  availableServices(): IAkashaModuleServices {
    return IAkashaModule.EXPORT_TO_CHANNEL([PROFILE_STORE, PROFILE_LEGACY], services);
  }

  protected init(di: DIContainer): void {
    const settingsObj: ICoreSettings = { moduleName, values: settings };
    const { setSettings } = callService(di)(coreServices.SETTINGS_SERVICE);
    setSettings(settingsObj);
  }
}

export default function registerModule() {
  return new ProfilesModule();
}
