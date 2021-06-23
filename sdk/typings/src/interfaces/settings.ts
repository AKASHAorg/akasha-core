import { ServiceCallResult } from './responses';

export default interface ISettingsService {
  set(
    moduleName: string,
    value: Record<string, unknown> | [[string, unknown]],
  ): ServiceCallResult<unknown>;
  get(moduleName: string): ServiceCallResult<unknown>;
  remove(moduleName: string): void;
}

export interface IAppSettings {
  /**
   * Returns an app configuration object
   * @param appName - Name of the app
   */
  get(appName: string): any;

  /**
   * Returns all installed apps
   */
  getAll(): any;

  /**
   * Persist installed app configuration for the current user
   * @param app - Object
   */
  install(app: unknown): any;

  /**
   * Uninstall app by name
   * @param appName - Name of the app
   */
  uninstall(appName: string): Promise<void>;
}
