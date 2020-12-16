import {
  IAkashaModule,
  IAkashaModuleServices,
  IAkashaNamedService,
  ICoreSettings,
} from '@akashaproject/sdk-core/lib/IAkashaModule';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { callService } from '@akashaproject/sdk-core/lib/utils';
import coreServices from '@akashaproject/sdk-core/lib/constants';
import settings from './settings';
import entryService from './entry.service';
import tagService from './tag.service';
import commentService from './comment.service';
import services, { moduleName, ENTRY_SERVICE, TAG_SERVICE, COMMENT_SERVICE } from './constants';

export class AuthModule extends IAkashaModule {
  public async init(di: DIContainer) {
    const settingsObj: ICoreSettings = { moduleName, values: settings };
    const { setSettings } = callService(di)(coreServices.SETTINGS_SERVICE);
    setSettings(settingsObj);
  }

  public availableServices(): IAkashaModuleServices {
    return IAkashaModule.EXPORT_TO_CHANNEL([ENTRY_SERVICE, TAG_SERVICE, COMMENT_SERVICE], services);
  }

  protected _name() {
    return moduleName;
  }

  protected _registerServices(di: any): IAkashaNamedService[] {
    return [entryService, tagService, commentService];
  }
}

export default function registerModule() {
  return new AuthModule();
}
