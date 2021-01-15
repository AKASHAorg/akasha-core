import { injectable, inject } from 'inversify';
import ISettingsService from '@akashaproject/sdk-typings/lib/interfaces/settings';
import { ObservableCallResult } from '@akashaproject/sdk-typings/lib/interfaces/basic';

@injectable()
class Settings implements ISettingsService {
  get(service: symbol): ObservableCallResult<object> {
    return undefined;
  }

  set(service: symbol, value: object): ObservableCallResult<object> {
    return undefined;
  }
}
export { Settings };
