import DIContainer from '../src/DIContainer';

let di: DIContainer;

beforeAll(() => {
  di = new DIContainer();
});

test('checks if it has serviceProvider property', () => {
  expect(di).toBeInstanceOf(DIContainer);
  expect(di).toHaveProperty('serviceProvider');
});

test('it registers a service', () => {
  const service = jest.fn();
  di.register('mockedService', service);
  expect(di.serviceProvider.container).toHaveProperty('mockedService');
});

test('it calls a registered service', () => {
  const service = jest.fn();
  const serviceName = 'asyncService';
  di.register(serviceName, service);
  // fetch service
  const firstConsumer = di.getService(serviceName);
  const secondConsumer = di.getService(serviceName);
  // its the same service
  expect(firstConsumer).toStrictEqual(secondConsumer);
  // the actual serviceProvider is build only on the first call
  // multiple consumer calls don't trigger service factory
  expect(service).toHaveBeenCalledTimes(1);
});
