import { ObservableCallResult } from './responses';

export default interface ISettingsService {
  set(
    moduleName: string,
    value: Record<string, unknown> | [[string, unknown]],
  ): ObservableCallResult<unknown>;
  get(moduleName: string): ObservableCallResult<unknown>;
  remove(moduleName: string): void;
}
