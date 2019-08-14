import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import {
  buildServicePath,
  callService,
  createServiceMethod,
  getService,
  getServiceName,
  invokeServiceMethod,
  registerServiceMethods,
  toNamedService,
} from '../src/utils';

jest.mock('@akashaproject/sdk-runtime/lib/DIContainer');
test('getServiceName builds service name', () => {
  const moduleName = 'testModule';
  const serviceName = 'serviceProvider';
  const expectedName = `${moduleName}=>${serviceName}`;
  expect(getServiceName({ moduleName, providerName: serviceName })).toBe(expectedName);
});

test('getService calls the service', () => {
  const servicePath: [string, string] = ['testModule', 'service'];
  const di = new DIContainer();
  getService(di, servicePath);
  expect(di.getService).toHaveBeenCalledTimes(1);
  expect(di.getService).toBeCalledWith(`${servicePath[0]}=>${servicePath[1]}`);
});

test('callService currying', () => {
  const servicePath: [string, string] = ['module', 'service'];
  const di = new DIContainer();
  const invoke = callService(di);
  expect(di.getService).not.toBeCalled();
  invoke(servicePath);
  expect(di.getService).toHaveBeenCalledTimes(1);
  expect(di.getService).toBeCalledWith(`${servicePath[0]}=>${servicePath[1]}`);
  expect(di.getService).toReturn();
});

test('toNamedService object build', () => {
  const service = jest.fn();
  const namedService = toNamedService('testService', service);
  expect(namedService).toHaveProperty('name');
  expect(namedService).toHaveProperty('service');
});

test('registerServiceMethods object build', () => {
  const service1 = jest.fn();
  const service2 = jest.fn();
  // this is a curried function
  const registeredServices = registerServiceMethods({ service1, service2 });
  // calling it multiple times doesn't generate new objects
  expect(registeredServices()).toHaveProperty('service1');
  expect(registeredServices()).toHaveProperty('service2');
});

test('buildServicePath array values', () => {
  const servicePath = ['module', 'service'];
  const otherService = 'otherService';
  const path = buildServicePath(servicePath[0]);
  const builtPath = path(servicePath[1]);
  const buildPath1 = path(otherService);
  expect(builtPath).toBeInstanceOf(Array);
  expect(builtPath).toEqual(servicePath);
  expect(buildPath1[1]).toStrictEqual(otherService);
});

test('createServiceMethod from object', () => {
  const returnedObj = { test: 1 };
  const method = createServiceMethod(returnedObj);
  expect(method()).toStrictEqual(returnedObj);
});

test('invokeServiceMethod calls the right fn', () => {
  const servicePath: [string, string] = ['module', 'service'];
  const methodName = 'q';
  const serviceMethod = { [methodName]: (p: { a: number }) => p.a + 1 };
  const di: any = new DIContainer();
  // mock the returned value from service
  di.getService.mockReturnValue(serviceMethod);
  const service = callService(di)(servicePath);
  const callMethod = invokeServiceMethod(methodName);
  const result = callMethod({ a: 1 }, service);
  expect(result).toStrictEqual(serviceMethod.q({ a: 1 }));
});
