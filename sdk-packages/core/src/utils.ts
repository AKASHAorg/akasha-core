import IDIContainer from '@akashaproject/sdk-runtime/lib/IDIContainer';
import R from 'ramda';
import {
  AkashaService,
  AkashaServiceMethods,
  AkashaServicePath,
  IAkashaModule,
  IAkashaNamedService,
} from './IAkashaModule';

// to not import explicit the module interface just for getting the serviceName
export function getServiceName(service: { moduleName: string; providerName: string }) {
  return R.identity(IAkashaModule.getServiceName(service.moduleName, service.providerName));
}

// ex: getService(di, ["commons_module", "ipfs"])
export function getService(di: IDIContainer, servicePath: AkashaServicePath): any {
  const [moduleName, providerName] = servicePath;
  return R.identity(di.getService(getServiceName({ moduleName, providerName })));
}

// execute call on service function
function _callService(di: IDIContainer, servicePath: AkashaServicePath) {
  const service = getService(di, servicePath);
  return R.identity(service);
}

export function callService(di: IDIContainer) {
  return R.curry(_callService)(di);
}

export function toNamedService(name: string, service: AkashaService): IAkashaNamedService {
  return R.identity(Object.freeze({ name, service }));
}

export function registerServiceMethods(methods: object): AkashaServiceMethods {
  return R.partial(R.identity, [Object.freeze(methods)]);
}

function _buildServicePath(moduleName: string, serviceName: string): AkashaServicePath {
  return [moduleName, serviceName];
}

export function buildServicePath(moduleName: string) {
  return R.curry(_buildServicePath)(moduleName);
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

function _callServiceMethod(
  di: IDIContainer,
  servicePath: AkashaServicePath,
  method: string,
  args?: object,
) {
  const service = callService(di)(servicePath);
  const callMethod = invokeServiceMethod(method);
  return callMethod(args, service);
}

export const callServiceMethod = R.curry(_callServiceMethod);
