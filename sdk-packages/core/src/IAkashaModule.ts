import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import pino from 'pino';
import * as R from 'ramda';
import { callService, logger } from './utils';

export interface IAkashaNamedService {
  name: string;
  service: AkashaService;
}

export type AkashaServiceMethods = R.Variadic<Promise<object>>;
export type AkashaService = (
  serviceInvoker: R.CurriedFunction1<[string, string], any>,
  logger?: pino,
) => AkashaServiceMethods;

export type AkashaServicePath = [string, string];

export interface IAkashaModuleServices {
  [serviceName: string]: AkashaServicePath;
}

export type IGeneralSettings = Array<[string, string | object]>;

export interface ICoreSettings {
  moduleName: string;
  values: IGeneralSettings;
}

// base class that should be extended in order to create an AKASHA sdk module
export abstract class IAkashaModule {
  public get name() {
    return this._name();
  }

  public static getServiceName(moduleName: string, providerName: string) {
    return `${moduleName}=>${providerName}`;
  }

  public static exportToChannel(serviceNames: string[], serviceRegistry: object): any {
    return R.pick(serviceNames, serviceRegistry);
  }
  protected logger: pino;

  constructor() {
    this.logger = logger.child({ sdkModule: this.name });
  }

  public wrapService(service: R.Variadic<object>, name: string) {
    const registeredMethods = service;
    const log = this.logger;
    // calls .bind.apply which is incompatible with ()=>
    // tslint:disable-next-line:only-arrow-functions
    return function() {
      log.info(`service < ${name} > was initialized.`);
      return registeredMethods();
    };
  }

  public startServices(di: DIContainer) {
    this.init(di);
    const services = this._registerServices(di);
    for (const provider of services) {
      const wrappedService = this.wrapService(
        provider.service(callService(di), this.logger.child({ service: provider.name })),
        provider.name,
      );
      const serviceName = IAkashaModule.getServiceName(this.name, provider.name);
      di.register(serviceName, wrappedService);
    }
  }

  public abstract availableServices(): IAkashaModuleServices;

  // can be used to initialise the settings for module
  protected abstract init(di: DIContainer): void;

  // module name used for building service path calls
  protected abstract _name(): string;

  // get a list with instances of each service factory
  protected abstract _registerServices(di: DIContainer): IAkashaNamedService[];
}
