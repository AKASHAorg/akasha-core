import { inject, injectable } from 'inversify';
import {
  EXTENSION_EVENTS,
  IntegrationIdSchema,
  IntegrationName,
  IntegrationNameSchema,
  TYPES,
} from '@akashaorg/typings/lib/sdk/index.js';
import DB from '../db/index.js';
import { createFormattedValue } from '../helpers/observable.js';
import Logging from '../logging/index.js';
import { throwError } from '../common/error-handling.js';
import EventBus from '../common/event-bus.js';
import pino from 'pino';
import { validate } from '../common/validator.js';
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
    const collection = this._db.getCollections().installedExtensions;
    const doc = await collection?.where('name').equals(appName).first();
    return createFormattedValue(doc);
  }

  /**
   * Returns all installed apps
   */
  async getAll() {
    const collection = this._db.getCollections().installedExtensions;
    const doc = await collection?.toArray();
    return createFormattedValue(doc);
  }

  /**
   * Persist installed app configuration for the current user
   * @param userDid - did of the user who installs this extension
   * @param release - extension release data
   */
  @validate(
    z.string(),
    z
      .object({
        appName: IntegrationNameSchema,
        releaseId: IntegrationIdSchema,
        version: z.string(),
      })
      .partial(),
  )
  async install(userDid: string, release: { appName: string; releaseId: string; version: string }) {
    const table = this._db.getCollections().installedExtensions;
    const collection = await table
      ?.where({ id: release.releaseId, version: release.version, userDid })
      .first();
    if (!collection) {
      await table?.add({
        id: release.releaseId,
        version: release.version,
        appName: release.appName,
        installedByDid: userDid,
      });
      this._globalChannel.next({
        event: EXTENSION_EVENTS.INSTALL_STATUS,
        data: { status: 'created' },
      });
      return true;
    }
    // update version
    if (collection && collection.version !== release.version) {
      collection.version = release.version;
      table?.update(collection.appName, { version: release.version });
      this._globalChannel.next({
        event: EXTENSION_EVENTS.UPDATE_VERSION,
        data: { version: release.version },
      });
      return true;
    }
  }

  /**
   * Uninstall app by name
   * @param appName - Name of the app
   */
  @validate(IntegrationNameSchema)
  async uninstall(appName: IntegrationName): Promise<void> {
    const currentInfo = await this.get(appName);
    if (currentInfo?.data?.id) {
      const collection = this._db.getCollections().installedExtensions;
      await collection?.where('id').equals(currentInfo.data.id).delete();
      this._globalChannel.next({
        data: { name: appName },
        event: EXTENSION_EVENTS.REMOVED,
      });
    }
  }
  @validate(IntegrationNameSchema)
  async toggleAppStatus(appName: IntegrationName): Promise<boolean> {
    // @todo: coming soon
    // const collection = this._db.getCollections().installedExtensions;
    // const doc = await collection?.where('name').equals(appName).first();
    // if (doc && doc.id) {
    //   doc.status = !doc.status;
    //   await collection?.where('id').equals(doc.id).modify(doc);
    //   this._globalChannel.next({
    //     data: { status: doc.status, name: appName },
    //     event: EXTENSION_EVENTS.TOGGLE_STATUS,
    //   });
    //   return doc.status;
    // }
    return false;
  }

  async updateVersion(app: { appName: string; releaseVersion: string }) {
    const table = this._db.getCollections().installedExtensions;

    const collection = await table
      ?.where({ appName: app.appName, version: app.releaseVersion })
      .first();

    if (!collection) {
      this._log.warn('app not found!');
      return;
    }

    if (collection && collection.version === app.releaseVersion) {
      this._log.warn('app has the same version!');
      return;
    }

    if (collection && collection.version !== app.releaseVersion) {
      const oldVersion = collection.version;
      collection.version = app.releaseVersion;
      table?.update(collection.appName, { version: app.releaseVersion });
      this._globalChannel.next({
        event: EXTENSION_EVENTS.UPDATE_VERSION,
        data: { oldVersion, currentVersion: app.releaseVersion },
      });
      return true;
    }
  }

  async updateConfig(app: ConfigInfo) {
    return throwError('Not implemented', ['sdk', 'settings', 'apps', 'updateConfig']);
  }
}

export default AppSettings;
