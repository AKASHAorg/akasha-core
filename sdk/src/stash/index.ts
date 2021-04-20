import IStashService, { IStash, LRUOptions } from '@akashaproject/sdk-typings/lib/interfaces/stash';
import { injectable } from 'inversify';
import { ObservableCallResult } from '@akashaproject/sdk-typings/lib/interfaces';
import QuickLRU from 'quick-lru';
import { createObservableValue } from '../helpers/observable';

@injectable()
class Stash implements IStashService {
  create(args: LRUOptions): ObservableCallResult<IStash> {
    const cache: IStash = new QuickLRU(args);
    return createObservableValue<IStash>(cache);
  }
}

export { Stash };
