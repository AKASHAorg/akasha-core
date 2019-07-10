import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';

export type AkashaService = { name: string, service: Function };

export abstract class IAkashaModule {
  public get name () {
    return this._name();
  }

  static async wrapService (fn: Function, name: string) {
    const serviceInstance = await fn();
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
    const services = this._registerServices();
    for (const provider of services) {
      const wrappedService = await IAkashaModule.wrapService(provider.service, provider.name);
      const serviceName = IAkashaModule.getServiceName(this.name, provider.name);
      di.register(serviceName, wrappedService);
    }
  }

  protected abstract _name (): string;

  protected abstract _registerServices (): AkashaService[]
}
