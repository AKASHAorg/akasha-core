import { ServiceCallResult } from './responses';

export interface LRUOptions {
  maxSize: number;
  maxAge: number;
}

interface IStashService<IStash> {
  // returns a new lru-cache instance
  create(args: LRUOptions): ServiceCallResult<IStash>;
  getUiStash(): IStash;
  computeKey(objKey: Record<string, unknown>): string;
}

export default IStashService;
