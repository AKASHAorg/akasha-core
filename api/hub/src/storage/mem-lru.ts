import { ILRU } from './i-lru';

export class MemLRU implements ILRU {
  private lru;

  constructor(lru) {
    this.lru = lru;
  }

  del(key: string): Promise<void> {
    return Promise.resolve(this.lru.del(key));
  }

  delete(key: string): Promise<void> {
    return this.del(key);
  }

  get<T>(key: string): Promise<T> {
    return Promise.resolve(this.lru.get(key));
  }

  has(key: string): Promise<boolean> {
    return Promise.resolve(this.lru.has(key));
  }

  set(key: string, value: unknown): Promise<void> {
    return Promise.resolve(this.lru.set(key, value));
  }

  public async sAdd(key: string, value: string) {
    let cachedValues: Set<string>;
    if (await this.has(key)) {
      cachedValues = await this.get(key);
    }
    cachedValues = new Set(cachedValues || []);
    cachedValues.add(value);
    return this.set(key, Array.from(cachedValues));
  }

  public async sMembers(key: string) {
    return this.get<string[]>(key);
  }

  public async sPop(key: string) {
    if (await this.has(key)) {
      const cachedValues: string[] = await this.get(key);
      const result: string = cachedValues.pop();
      await this.set(key, cachedValues);
      return result;
    }
    return Promise.resolve();
  }
}
