import { ObservableCallResult } from './responses';

export interface LRUOptions {
  maxSize: number;
  maxAge: number;
}

export interface IStash {
  get(key: string): unknown;

  set(key: string, value: unknown): IStash;

  peek(key: string): unknown;

  delete(key: string): boolean;
  // reset the cache
  clear(): void;
}

export default interface IStashService {
  // returns a new lru-cache instance
  create(args: LRUOptions): ObservableCallResult<IStash>;
}
