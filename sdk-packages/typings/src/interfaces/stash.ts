import { ObservableCallResult } from './basic';

export interface IStash {
  readonly cache;
  get(key: string): any;

  set(key: string, value: any): void;

  remove(key: string): void;
  // reset the cache
  clear(): void;
}

export default interface IStashService {
  // returns a new lru-cache instance
  create(args: {
    max: number;
    maxAge: number;
    updateAgeOnGet?: boolean;
  }): ObservableCallResult<IStash>;
}
