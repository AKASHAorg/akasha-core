import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { SETTINGS_SERVICE } from '../src/constants';
import settingsService from '../src/settings.service';
import { callService } from '../src/utils';

jest.mock('@akashaproject/sdk-runtime/lib/DIContainer');

test('contains required attributes', () => {
  expect(settingsService).toHaveProperty('name');
  expect(settingsService).toHaveProperty('service');
  expect(settingsService.name).toStrictEqual(SETTINGS_SERVICE);
});

test('register service methods', () => {
  const di = new DIContainer();
  const service = settingsService.service(callService(di));
  expect(service()).toHaveProperty('getSettings');
  expect(service()).toHaveProperty('setSettings');
});

test('setSettings/getSettings methods', () => {
  const di = new DIContainer();
  const service: any = settingsService.service(callService(di));
  const serviceSettings = ['serviceName2', { q: 1 }];
  expect(
    service().setSettings({
      moduleName: 'moduleName',
      values: [['serviceName1', 'payload'], serviceSettings],
    }),
  ).toBeUndefined();

  expect(service().getSettings('moduleName')).toStrictEqual({
    serviceName1: 'payload',
    serviceName2: { q: 1 },
  });
});
