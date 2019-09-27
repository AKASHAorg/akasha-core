import {
  IAkashaModule,
  IAkashaModuleServices,
  IAkashaNamedService,
} from '@akashaproject/sdk-core/lib/IAkashaModule';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import boxService from './3box.service';
import services, { BOX_SERVICE, moduleName } from './constants';

export class BoxModule extends IAkashaModule {
  public availableServices(): IAkashaModuleServices {
    return IAkashaModule.exportToChannel([BOX_SERVICE], services);
  }
  protected _name(): string {
    return moduleName;
  }

  protected _registerServices(di: DIContainer): IAkashaNamedService[] {
    return [boxService];
  }

  // tslint:disable-next-line:no-empty
  protected init(di: DIContainer): void {}
}

export default function registerModule() {
  return new BoxModule();
}
