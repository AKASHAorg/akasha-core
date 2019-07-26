import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { services as coreServices } from '@akashaproject/sdk-core/lib/constants';
import { callService } from '@akashaproject/sdk-core/lib/utils';
import { moduleName, services } from './constants';
import settings from './settings';
import { ICoreSettings } from '@akashaproject/sdk-core/lib/settings';
import registerWeb3Provider from './web3-provider';
import registerIpfsProvider from './ipfs-provider';
import registerWalletService from './wallet';
import registerWeb3Utils from './web3-utils';
import registerValidatorProvider from './validator-provider';
import registerCacheProvider from './cache-provider';

import {
  AkashaModuleServices,
  AkashaServiceFactory,
  IAkashaModule
} from '@akashaproject/sdk-core/lib/IAkashaModule';

export class CommonsModule extends IAkashaModule {

  public async init (di: DIContainer) {
    const settingsObj: ICoreSettings = { moduleName, values: settings };
    const settingsService = await callService(di, coreServices.SETTINGS_SERVICE);
    settingsService.setSettings(settingsObj);
  }

  protected _getServiceFactories (): AkashaServiceFactory[] {
    return [
      registerWeb3Provider,
      registerIpfsProvider,
      registerWalletService,
      registerWeb3Utils,
      registerValidatorProvider,
      registerCacheProvider
    ];
  }

  protected availableServices (): AkashaModuleServices {
    return services;
  }

  protected _name () {
    return moduleName;
  }
}

export default function registerModule () {
  return new CommonsModule();
}
