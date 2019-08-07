import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import R from 'ramda';
import { moduleName } from './constants';
import { IAkashaModule, IAkashaModuleServices, IAkashaNamedService } from './IAkashaModule';
import settingsService from './settings.service';

class CoreModule extends IAkashaModule {
  public availableServices(): IAkashaModuleServices {
    return null;
  }
  // tslint:disable-next-line:no-empty
  protected init(di: DIContainer): void {
    R.T();
  }

  protected _registerServices(): IAkashaNamedService[] {
    return [settingsService];
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
