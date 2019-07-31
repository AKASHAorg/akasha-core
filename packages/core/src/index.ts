import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import registerSettingsProvider from './settings';
import { moduleName } from './constants';
import { AkashaServiceFactory, IAkashaModule, AkashaModuleServices } from './IAkashaModule';

class CoreModule extends IAkashaModule {

  init (di: DIContainer): void {
  }

  protected _getServiceFactories (): AkashaServiceFactory[] {
    return [
      registerSettingsProvider
    ];
  }

  protected _name (): string {
    return moduleName;
  }

  public availableServices (): AkashaModuleServices {
    return null;
  }
}

// create the dependency injection container and the cache list handler
export default async function bootstrapFactory () {
  const di = new DIContainer();
  const coreModule = new CoreModule();
  await coreModule.startServices(di);
  // these instances are required to instantiate the packages used for building the akasha-sdk
  return di;
}
