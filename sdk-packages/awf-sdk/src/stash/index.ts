import IStashService, { IStash } from '@akashaproject/sdk-typings/lib/interfaces/stash';
import { injectable } from 'inversify';
import { ObservableCallResult } from '@akashaproject/sdk-typings/lib/interfaces/basic';

@injectable()
class Stash implements IStashService {
  create(args: {
    max: number;
    maxAge: number;
    updateAgeOnGet?: boolean;
  }): ObservableCallResult<IStash> {
    return undefined;
  }
}

export { Stash };
