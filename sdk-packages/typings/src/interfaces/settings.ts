import { ObservableCallResult } from './basic';

export default interface ISettingsService {
  set(service: symbol, value: object): ObservableCallResult<object>;
  get(service: symbol): ObservableCallResult<object>;
}
