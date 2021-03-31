import { ILRU } from './i-lru';

export class MemLRU implements ILRU {
  private lru: any;

  constructor(lru: any) {
    this.lru = lru;
  }

  del(key: string): Promise<void> {
    return Promise.resolve(this.lru.del(key));
  }

  get(key: string): Promise<any> {
    return Promise.resolve(this.lru.get(key));
  }

  has(key: string): Promise<boolean> {
    return Promise.resolve(this.lru.has(key));
  }

  set(key: string, value: any): Promise<void> {
    return Promise.resolve(this.lru.set(key, value));
  }
}
