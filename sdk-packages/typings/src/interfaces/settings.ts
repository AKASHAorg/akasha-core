import { ObservableCallResult } from './responses';

export default interface ISettingsService {
  set(moduleName: string, value: object): ObservableCallResult<object>;
  get(moduleName: string): ObservableCallResult<object>;
  remove(moduleName: string): void;
}
