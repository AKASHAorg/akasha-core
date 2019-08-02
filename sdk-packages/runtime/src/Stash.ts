import IStash from './IStash';

// tslint:disable-next-line:no-var-requires
const LRU = require('lru-cache');

export default class Stash implements IStash {
  public readonly cache;

  constructor(options?: object) {
    this.cache = new LRU(options);
  }

  get entries() {
    return this.cache;
  }

  public get(key: string): object {
    return this.cache.get(key);
  }

  public set(key: string, value: object): void {
    this.cache.set(key, value);
  }
}
