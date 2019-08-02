import { services as coreServices } from '@akashaproject/sdk-core/lib/constants';
import { ICoreSettings } from '@akashaproject/sdk-core/lib/settings';
import { callService } from '@akashaproject/sdk-core/lib/utils';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import registerCacheProvider from './cache-provider';
import { moduleName, services } from './constants';
import registerIpfsProvider from './ipfs-provider';
import settings from './settings';
import registerValidatorProvider from './validator-provider';
import registerWalletService from './wallet';
import registerWeb3Provider from './web3-provider';
import registerWeb3Utils from './web3-utils';

import {
  AkashaServiceFactory,
  IAkashaModule,
  IAkashaModuleServices
} from '@akashaproject/sdk-core/lib/IAkashaModule';

export class CommonsModule extends IAkashaModule {
  public async init(di: DIContainer) {
    const settingsObj: ICoreSettings = { moduleName, values: settings };
    const settingsService = await callService(di, coreServices.SETTINGS_SERVICE);
    settingsService.setSettings(settingsObj);
  }

  public availableServices(): IAkashaModuleServices {
    return services;
  }

  protected _getServiceFactories(): AkashaServiceFactory[] {
    return [
      registerWeb3Provider,
      registerIpfsProvider,
      registerWalletService,
      registerWeb3Utils,
      registerValidatorProvider,
      registerCacheProvider
    ];
  }

  protected _name() {
    return moduleName;
  }
}

export default function registerModule() {
  return new CommonsModule();
}
