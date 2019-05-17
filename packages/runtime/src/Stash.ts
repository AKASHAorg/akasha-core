import IStash from './IStash';
const LRU = require('lru-cache');

export default class Stash implements IStash {
  readonly cache;

  constructor (options?: Object) {
    this.cache = new LRU(options);
  }

  get (key: string): Object {
    return this.cache.get(key);
  }

  set (key: string, value: Object): void {
    this.cache.set(key, value);
  }

  get entries () {
    return this.cache;
  }
}
