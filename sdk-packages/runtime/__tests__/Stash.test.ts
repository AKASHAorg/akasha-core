import Stash from '../src/Stash';

let stash: Stash;
const cacheEntry = { key: 'my-key', value: { test: 1 } };
beforeAll(() => {
  stash = new Stash();
});
test('checks if it has entries property', () => {
  expect(stash).toBeInstanceOf(Stash);
  expect(stash).toHaveProperty('entries');
});

test('sets a key => value pair in cache', () => {
  expect(stash.set(cacheEntry.key, cacheEntry.value));
  expect(stash.entries.has(cacheEntry.key)).toBeTruthy();
  expect(stash.entries.has('random-key')).toBeFalsy();
});

test('fetches a value from a cache key', () => {
  stash.set('other-key', cacheEntry);
  expect(stash.get('other-key')).toStrictEqual(cacheEntry);
});
