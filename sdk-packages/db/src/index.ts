import coreServices from '@akashaproject/sdk-core/lib/constants';
import {
  IAkashaModule,
  IAkashaModuleServices,
  IAkashaNamedService,
  ICoreSettings,
} from '@akashaproject/sdk-core/lib/IAkashaModule';
import { callService } from '@akashaproject/sdk-core/lib/utils';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import services, {
  DB_INSTALLED_APPS_SERVICE,
  DB_SETTINGS_ATTACHMENT,
  moduleName,
} from './constants';
import settings from './settings';
import settingsAttachmentService from './settings.attachment.service';
import appService from './apps.service';

export class DBModule extends IAkashaModule {
  public availableServices(): IAkashaModuleServices {
    return IAkashaModule.EXPORT_TO_CHANNEL(
      [DB_SETTINGS_ATTACHMENT, DB_INSTALLED_APPS_SERVICE],
      services,
    );
  }

  protected _name(): string {
    return moduleName;
  }

  // tslint:disable-next-line:function-name
  protected _registerServices(di: DIContainer): IAkashaNamedService[] {
    return [settingsAttachmentService, appService];
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
