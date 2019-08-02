import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { moduleName } from './constants';
import { AkashaServiceFactory, IAkashaModule, IAkashaModuleServices } from './IAkashaModule';
import registerSettingsProvider from './settings';

class CoreModule extends IAkashaModule {
  // tslint:disable-next-line:no-empty
  public init(di: DIContainer): void {}

  public availableServices(): IAkashaModuleServices {
    return null;
  }

  protected _getServiceFactories(): AkashaServiceFactory[] {
    return [registerSettingsProvider];
  }

  protected _name(): string {
    return moduleName;
  }
}

// create the dependency injection container and the cache list handler
export default async function bootstrapFactory() {
  const di = new DIContainer();
  const coreModule = new CoreModule();
  await coreModule.startServices(di);
  // these instances are required to instantiate the packages used for building the akasha-sdk
  return di;
}
