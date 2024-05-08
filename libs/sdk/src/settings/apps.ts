import { inject, injectable } from 'inversify';
import {
  APP_EVENTS,
  IntegrationIdSchema,
  IntegrationName,
  IntegrationNameSchema,
  TYPES,
} from '@akashaorg/typings/lib/sdk';
import DB from '../db';
import { createFormattedValue } from '../helpers/observable';
import Logging from '../logging/index';
import { throwError } from '../common/error-handling';
import EventBus from '../common/event-bus';
import pino from 'pino';
import { validate } from '../common/validator';
import { z } from 'zod';

declare const __DEV__: boolean;

export interface VersionInfo {
  name: string;
  version: string;
}
export interface ConfigInfo {
  name: string;
  config: string[][];
}
@injectable()
class AppSettings {
  private _db: DB;
  private _log: pino.Logger;
  private _globalChannel: EventBus;

  constructor(
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Db) db: DB,
    @inject(TYPES.EventBus) globalChannel: EventBus,
  ) {
    this._log = log.create('AWF_Settings_Apps');
    this._db = db;
    this._globalChannel = globalChannel;
  }

  /**
   * Returns an app configuration object
   * @param appName - Name of the app
   */
  @validate(IntegrationNameSchema)
  async get(appName: IntegrationName) {
    const collection = this._db.getCollections().integrations;
    const doc = await collection?.where('name').equals(appName).first();
    return createFormattedValue(doc);
  }

  /**
   * Returns all installed apps
   */
  async getAll() {
    const collection = this._db.getCollections().integrations;
    const doc = await collection?.toArray();
    return createFormattedValue(doc);
  }

  /**
   * Persist installed app configuration for the current user
   * @param app - Object
   * @param isLocal - True only for development. Default is false
   */
  @validate(
    z.object({ name: IntegrationNameSchema, id: IntegrationIdSchema }).partial(),
    z.boolean().optional(),
  )
  async install(app: { name: string; id?: string }, isLocal = false) {
    return throwError('Not implemented', ['sdk', 'settings', 'apps', 'install']);
  }

  /**
   * Uninstall app by name
   * @param appName - Name of the app
   */
  @validate(IntegrationNameSchema)
  async uninstall(appName: IntegrationName): Promise<void> {
    const currentInfo = await this.get(appName);
    if (currentInfo?.data?.id) {
      const collection = this._db.getCollections().integrations;
      await collection?.where('id').equals(currentInfo.data.id).delete();
      this._globalChannel.next({
        data: { name: appName },
        event: APP_EVENTS.REMOVED,
      });
    }
  }
  @validate(IntegrationNameSchema)
  async toggleAppStatus(appName: IntegrationName): Promise<boolean> {
    const collection = this._db.getCollections().integrations;
    const doc = await collection?.where('name').equals(appName).first();
    if (doc && doc.id) {
      doc.status = !doc.status;
      await collection?.where('id').equals(doc.id).modify(doc);
      this._globalChannel.next({
        data: { status: doc.status, name: appName },
        event: APP_EVENTS.TOGGLE_STATUS,
      });
      return doc.status;
    }
    return false;
  }

  async updateVersion(app: VersionInfo) {
    return throwError('Not implemented', ['sdk', 'settings', 'apps', 'updateVersion']);
  }

  async updateConfig(app: ConfigInfo) {
    return throwError('Not implemented', ['sdk', 'settings', 'apps', 'updateConfig']);
  }
}

export default AppSettings;
