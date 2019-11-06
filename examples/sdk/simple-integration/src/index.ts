import {
  IAkashaModule,
  IAkashaModuleServices,
  IAkashaNamedService,
} from '@akashaproject/sdk-core/lib/IAkashaModule';
import { buildServicePath } from '@akashaproject/sdk-core/lib/utils';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import simpleService, { serviceName } from './simple.service';

export class SimpleModule extends IAkashaModule {
  public availableServices(): IAkashaModuleServices {
    return {
      [serviceName]: buildServicePath(this._name())(serviceName),
    };
  }
  protected _name(): string {
    return 'simple-module';
  }

  protected _registerServices(di: DIContainer): IAkashaNamedService[] {
    return [simpleService];
  }

  protected init(di: DIContainer): void {
    // fetch or set settings
  }
}

export default function simpleModuleFactory() {
  return new SimpleModule();
}
