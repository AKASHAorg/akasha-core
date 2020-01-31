import IDIContainer from '@akashaproject/sdk-runtime/lib/IDIContainer';
import pino from 'pino';
import * as R from 'ramda';
import {
  AkashaService,
  AkashaServiceMethods,
  AkashaServicePath,
  CallableServiceMethods,
  IAkashaModule,
  IAkashaNamedService,
} from './IAkashaModule';

export const logger = pino({ browser: { asObject: true } });

// to not import explicit the module interface just for getting the serviceName
export function getServiceName(service: { moduleName: string; providerName: string }) {
  return R.identity(IAkashaModule.GET_SERVICE_NAME(service.moduleName, service.providerName));
}

// ex: getService(di, ["commons_module", "ipfs"])
export function getService(di: IDIContainer, servicePath: AkashaServicePath): any {
  const [moduleName, providerName] = servicePath;
  return R.identity(di.getService(getServiceName({ moduleName, providerName })));
}

// execute call on service function
function cService(di: IDIContainer, servicePath: AkashaServicePath) {
  const service = getService(di, servicePath);
  return R.identity(service);
}

export function callService(di: IDIContainer) {
  return R.curry(cService)(di);
}

export function toNamedService(name: string, service: AkashaService): IAkashaNamedService {
  if (!name || !service) {
    throw new Error(`Service ${name} must provide name and service attributes`);
  }
  return R.identity(Object.freeze({ name, service }));
}

export function registerServiceMethods(methods: object): CallableServiceMethods {
  return R.partial(R.identity, [Object.freeze(methods)]);
}

function bServicePath(moduleName: string, serviceName: string): AkashaServicePath {
  return [moduleName, serviceName];
}

export function buildServicePath(moduleName: string) {
  return R.curry(bServicePath)(moduleName);
}

// create a function around an object type service
export function createServiceMethod(method: object) {
  return R.partial(R.identity, [method]);
}

export function invokeServiceMethod(
  method: string,
): R.CurriedFunction2<object, AkashaServiceMethods, any> {
  return R.curry(R.invoker(1, method));
}

function cServiceMethod(
  di: IDIContainer,
  servicePath: AkashaServicePath,
  method: string,
  args: any,
) {
  const service = callService(di)(servicePath);
  const callMethod = invokeServiceMethod(method);
  return callMethod(args, service);
}

export const callServiceMethod = R.curry(cServiceMethod);

// es2019
// tslint:disable-next-line:prefer-array-literal
export function fromEntries(entries: [string | number, any][]) {
  return R.fromPairs(entries);
}

export function toEntries(obj: object) {
  return R.toPairs(obj);
}

export function toCurried(fn: any) {
  return R.curry(fn);
}
