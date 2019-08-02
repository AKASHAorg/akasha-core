import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import IDIContainer from '@akashaproject/sdk-runtime/lib/IDIContainer';

export interface IAkashaService {
  name: string;
  service: () => any;
}

export type AkashaServiceFactory = (di: IDIContainer) => IAkashaService;

export type AkashaServicePath = [string, string];

export interface IAkashaModuleServices {
  [serviceName: string]: AkashaServicePath;
}

// base class that should be extended in order to create an AKASHA sdk module
export abstract class IAkashaModule {
  public get name() {
    return this._name();
  }

  public static async wrapService(service: () => void, name: string) {
    const serviceInstance = await service();
    // calls .bind.apply which is incompatible with ()=>
    // tslint:disable-next-line:only-arrow-functions
    return function() {
      // tslint:disable-next-line:no-console
      console.log(`[info] service < ${name} > was accessed.`);
      return serviceInstance;
    };
  }

  public static getServiceName(moduleName: string, providerName: string) {
    return `${moduleName}=>${providerName}`;
  }

  public abstract init(di: DIContainer): void;

  public async startServices(di: DIContainer) {
    this.init(di);
    const services = this._registerServices(di);
    for (const provider of services) {
      const wrappedService = await IAkashaModule.wrapService(provider.service, provider.name);
      const serviceName = IAkashaModule.getServiceName(this.name, provider.name);
      di.register(serviceName, wrappedService);
    }
  }

  public abstract availableServices(): IAkashaModuleServices;

  protected abstract _getServiceFactories(): AkashaServiceFactory[];

  protected abstract _name(): string;

  // get a list with instances of each service factory
  private _registerServices(di): IAkashaService[] {
    const factories = this._getServiceFactories();
    const services: IAkashaService[] = [];
    for (const factory of factories) {
      services.push(factory(di));
    }
    return services;
  }
}
