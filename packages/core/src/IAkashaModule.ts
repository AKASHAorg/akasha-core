import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import IDIContainer from '@akashaproject/sdk-runtime/lib/IDIContainer';

export interface AkashaService { name: string, service: Function }
export type AkashaServiceFactory = (di: IDIContainer) => AkashaService;
export type AkashaServicePath = [string, string];
export interface AkashaModuleServices {
  [serviceName: string]: AkashaServicePath;
}

export abstract class IAkashaModule {
  public get name () {
    return this._name();
  }

  static async wrapService (service: Function, name: string) {
    const serviceInstance = await service();
    return function() {
      console.log(`[info] service < ${name} > was accessed.`);
      return serviceInstance;
    };
  }

  static getServiceName (moduleName: string, providerName: string) {
    return `${moduleName}=>${providerName}`;
  }

  abstract init (di: DIContainer): void

  public async startServices (di: DIContainer) {
    this.init(di);
    const services = this._registerServices(di);
    for (const provider of services) {
      const wrappedService = await IAkashaModule.wrapService(provider.service, provider.name);
      const serviceName = IAkashaModule.getServiceName(this.name, provider.name);
      di.register(serviceName, wrappedService);
    }
  }

  protected abstract _getServiceFactories (): AkashaServiceFactory[];

  protected abstract _name (): string;
  protected abstract availableServices(): AkashaModuleServices;

  // get a list with instances of each service factory
  private _registerServices (di): AkashaService[] {
    const factories = this._getServiceFactories();
    const services: AkashaService[] = [];
    for (const factory of factories) {
      services.push(factory(di));
    }
    return services;
  }

}
