import coreServices from '@akashaproject/sdk-core/lib/constants';
import {
  IAkashaModule,
  IAkashaModuleServices,
  IAkashaNamedService,
  ICoreSettings,
} from '@akashaproject/sdk-core/lib/IAkashaModule';
import { callService } from '@akashaproject/sdk-core/lib/utils';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import cacheService from './cache.service';
import services, {
  moduleName,
  VALIDATOR_SERVICE,
  WEB3_SERVICE,
  WEB3_UTILS_SERVICE,
} from './constants';
import ipfsService from './ipfs.service';
import settings from './settings';
import validatorService from './validator.service';
import web3UtilsService from './web3-utils.service';
import web3Service from './web3.service';

export class CommonsModule extends IAkashaModule {
  public async init(di: DIContainer) {
    const settingsObj: ICoreSettings = { moduleName, values: settings };
    const { setSettings } = callService(di)(coreServices.SETTINGS_SERVICE);
    setSettings(settingsObj);
  }

  public availableServices(): IAkashaModuleServices {
    return IAkashaModule.exportToChannel(
      [WEB3_UTILS_SERVICE, VALIDATOR_SERVICE, WEB3_SERVICE],
      services,
    );
  }

  protected _name() {
    return moduleName;
  }

  protected _registerServices(di: any): IAkashaNamedService[] {
    return [cacheService, ipfsService, validatorService, web3Service, web3UtilsService];
  }
}

export default function registerModule() {
  return new CommonsModule();
}
