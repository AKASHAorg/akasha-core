import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { moduleName, SETTINGS_SERVICE } from '../src/constants';
import createCoreModule from '../src/index';
import { callServiceMethod } from '../src/utils';

test('creates the core-module', () => {
  const di = createCoreModule();
  expect(di).toBeInstanceOf(DIContainer);
});

test('registers service methods', () => {
  const di = createCoreModule();
  callServiceMethod(di, [moduleName, SETTINGS_SERVICE], 'setSettings', {
    moduleName: 'moduleName1',
    values: [['sN1', 'payload1']],
  });

  const result = callServiceMethod(
    di,
    [moduleName, SETTINGS_SERVICE],
    'getSettings',
    'moduleName1',
  );
  expect(result).toStrictEqual({ sN1: 'payload1' });
});
