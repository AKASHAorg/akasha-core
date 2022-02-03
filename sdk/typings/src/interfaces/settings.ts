import { ServiceCallResult } from './responses';

interface ISettingsService {
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
  get(appName: string): Promise<any>;

  /**
   * Returns all installed apps
   */
  getAll(): Promise<any>;

  /**
   * Persist installed app configuration for the current user
   * @param app - Object
   */
  install(app: unknown): Promise<string[] | boolean | any>;

  /**
   * Uninstall app by name
   * @param appName - Name of the app
   */
  uninstall(appName: string): Promise<void>;
}

export default ISettingsService;
