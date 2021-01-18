import { ObservableCallResult } from './responses';

export interface LRUOptions {
  maxSize: number;
  maxAge: number;
}

export interface IStash {
  get(key: any): any;

  set(key: any, value: any): IStash;

  peek(key: any): any;

  delete(key: any): boolean;
  // reset the cache
  clear(): void;
}

export default interface IStashService {
  // returns a new lru-cache instance
  create(args: LRUOptions): ObservableCallResult<IStash>;
}
