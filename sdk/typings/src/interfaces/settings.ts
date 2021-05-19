import { ServiceCallResult } from './responses';

export default interface ISettingsService {
  set(
    moduleName: string,
    value: Record<string, unknown> | [[string, unknown]],
  ): ServiceCallResult<unknown>;
  get(moduleName: string): ServiceCallResult<unknown>;
  remove(moduleName: string): void;
}
