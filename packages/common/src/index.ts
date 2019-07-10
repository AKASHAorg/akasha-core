import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { SETTINGS_SERVICE } from '@akashaproject/sdk-core/lib/constants';
import { moduleName } from './constants';
import settings from './settings';
import { ICoreSettings } from '@akashaproject/sdk-core/lib/settings';
import registerWeb3Provider from './web3-provider';
import registerIpfsProvider from './ipfs-provider';
import registerWalletService from './wallet';
import registerWeb3Utils from './web3-utils';
import { AkashaService, IAkashaModule } from '@akashaproject/sdk-core/lib/IAkashaModule';

export class CommonsModule extends IAkashaModule {
  private services: AkashaService[] = [];

  public init (di: DIContainer): void {
    const settingsObj: ICoreSettings = { moduleName, values: settings };
    di.getService(SETTINGS_SERVICE).setSettings(settingsObj);
    this.services.push(registerWeb3Provider(di));
    this.services.push(registerIpfsProvider(di));
    this.services.push(registerWalletService(di));
    this.services.push(registerWeb3Utils(di));
  }

  protected _registerServices (): AkashaService[] {
    return this.services;
  }

  protected _name () {
    return moduleName;
  }
}

export default function registerModule () {
  return new CommonsModule();
}
