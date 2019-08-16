import services, { moduleName, SETTINGS_SERVICE } from '../src/constants';

test('it has a moduleName defined', () => {
  expect(moduleName).toBeDefined();
  expect(typeof moduleName).toBe('string');
});

test('it has services defined and exported', () => {
  expect(SETTINGS_SERVICE).toBeDefined();
  expect(typeof SETTINGS_SERVICE).toBe('string');
});

test('it has services object', () => {
  expect(services).toBeDefined();
  expect(services[SETTINGS_SERVICE]).toBeInstanceOf(Array);
  expect(services[SETTINGS_SERVICE].length).toBe(2);
});
