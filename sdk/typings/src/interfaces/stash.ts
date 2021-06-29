import { ServiceCallResult } from './responses';

export interface LRUOptions {
  maxSize: number;
  maxAge: number;
}

export default interface IStashService<IStash> {
  // returns a new lru-cache instance
  create(args: LRUOptions): ServiceCallResult<IStash>;
}
