import { inject, injectable } from 'inversify';
import {
  EXTENSION_EVENTS,
  IntegrationIdSchema,
  IntegrationName,
  IntegrationNameSchema,
  TYPES,
} from '@akashaorg/typings/lib/sdk';
import DB from '../db';
import { createFormattedValue } from '../helpers/observable';
import Logging from '../logging';
import { throwError } from '../common/error-handling';
import EventBus from '../common/event-bus';
import pino from 'pino';
import { validate } from '../common/validator';
import { z } from 'zod';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

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
    const doc = await collection?.where('appName').equals(appName).first();
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
   * @param release - extension release data
   */
  @validate(
    z.object({
      appName: IntegrationNameSchema,
      releaseId: IntegrationIdSchema,
      source: z.string(),
      version: z.string(),
      applicationType: z.nativeEnum(AkashaAppApplicationType),
      termsAccepted: z.optional(z.boolean()),
    }),
  )
  async install(release: {
    appName: string;
    releaseId: string;
    version: string;
    source: string;
    applicationType: AkashaAppApplicationType;
    termsAccepted?: boolean;
  }) {
    const table = this._db.getCollections().installedExtensions;
    const collection = await table?.get({ appName: release.appName });
    if (!collection) {
      await table?.add({ ...release, termsAccepted: release.termsAccepted ?? false });
    }
    // update version
    if (collection && collection.version !== release.version) {
      collection.version = release.version;
      table?.update(collection.appName, {
        version: release.version,
        releaseId: release.releaseId,
        source: release.source,
      });
    }
  }

  /**
   * Uninstall app by name
   * @param appName - Name of the app
   */
  @validate(IntegrationNameSchema)
  async uninstall(appName: IntegrationName): Promise<void> {
    const currentInfo = await this.get(appName);
    if (currentInfo?.data?.releaseId) {
      const collection = this._db.getCollections().installedExtensions;
      await collection?.delete(appName);
    }
  }
  @validate(IntegrationNameSchema)
  async toggleAppStatus(appName: IntegrationName): Promise<boolean> {
    return false;
  }

  async updateVersion(app: { appName: string; releaseVersion: string }) {}

  async updateConfig(app: ConfigInfo) {
    return throwError('Not implemented', ['sdk', 'settings', 'apps', 'updateConfig']);
  }
}

export default AppSettings;
