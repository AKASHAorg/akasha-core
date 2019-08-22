import services, { DB_SERVICE, DB_SYNC_ENDPOINT, moduleName } from '../src/constants';

test('it has a moduleName defined', () => {
  expect(moduleName).toBeDefined();
  expect(typeof moduleName).toBe('string');
});

test('it has sync endpoint defined', () => {
  expect(DB_SYNC_ENDPOINT).toBeDefined();
  expect(typeof DB_SYNC_ENDPOINT).toBe('string');
});

test('it has services defined and exported', () => {
  expect(DB_SERVICE).toBeDefined();
  expect(typeof DB_SERVICE).toBe('string');
});

test('it has services object', () => {
  expect(services).toBeDefined();
  expect(services[DB_SERVICE]).toBeInstanceOf(Array);
  expect(services[DB_SERVICE].length).toBe(2);
});
