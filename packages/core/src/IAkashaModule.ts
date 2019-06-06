import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';

export type AkashaService = { name: string, service: Function };

export abstract class IAkashaModule {
  public get name () {
    return this._name();
  }

  static async wrapService (fn: Function, name: string) {
    const payload = await fn();
    return function() {
      console.log(`[info] service < ${name} > was accessed.`);
      return { payload };
    };
  }

  abstract init (di: DIContainer): void

  public startServices (di: DIContainer) {
    const services = this._registerServices();

    services.forEach(async provider => {
      const wrappedService = await IAkashaModule.wrapService(provider.service, provider.name);
      di.register(`[${this.name}]=>${provider.name}`, wrappedService);
    });
  }

  protected abstract _name (): string;

  protected abstract _registerServices (): AkashaService[]
}
