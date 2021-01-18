import { injectable, inject } from 'inversify';
import ISettingsService from '@akashaproject/sdk-typings/lib/interfaces/settings';
import { ObservableCallResult } from '@akashaproject/sdk-typings/lib/interfaces/responses';
import IDBService from '@akashaproject/sdk-typings/lib/interfaces/db';
import { TYPES } from '@akashaproject/sdk-typings';

@injectable()
class Settings implements ISettingsService {
  @inject(TYPES.Db) private _db: IDBService;

  get(service: symbol): ObservableCallResult<object> {
    return undefined;
  }

  set(service: symbol, value: object): ObservableCallResult<object> {
    return undefined;
  }

  loadUserSettings(): ObservableCallResult<boolean> {
    return undefined;
  }
}
export { Settings };
