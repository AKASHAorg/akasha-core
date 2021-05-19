import { LRUOptions } from '@akashaproject/sdk-typings/lib/interfaces/stash';
import { injectable } from 'inversify';
import { IStashService, ServiceCallResult } from '@akashaproject/sdk-typings/lib/interfaces';
import QuickLRU from 'quick-lru';
import { createObservableValue } from '../helpers/observable';

export type IQuickLRU = QuickLRU<string, any>;
@injectable()
class Stash implements IStashService<IQuickLRU> {
  /**
   *
   * @param args - Object with props maxSize: number and maxAge: number
   * @returns a new instance of QuickLRU
   */
  create(args: LRUOptions): ServiceCallResult<IQuickLRU> {
    const cache = new QuickLRU<string, never>(args);
    return createObservableValue(cache);
  }
}

export { Stash };
