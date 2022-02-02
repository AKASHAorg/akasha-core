import { inject, injectable } from 'inversify';
import { TYPES } from '@akashaproject/sdk-typings';
import DB, { availableCollections } from '../db';
import { createFormattedValue } from '../helpers/observable';
import { lastValueFrom } from 'rxjs';
import { AppsSchema } from '../db/app.schema';
import Logging from '../logging/index';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import { IAppSettings } from '@akashaproject/sdk-typings/lib/interfaces/settings';
import IcRegistry from '../registry/icRegistry';
import { ethers } from 'ethers';

export interface VersionInfo {
  name: string;
  version: string;
}
export interface ConfigInfo {
  name: string;
  config: string[][];
}
@injectable()
class AppSettings implements IAppSettings {
  private _db: DB;
  private _log: ILogger;
  private _icRegistry: IcRegistry;

  constructor(
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Db) db: DB,
    @inject(TYPES.ICRegistry) icRegistry: IcRegistry,
  ) {
    this._log = log.create('AWF_Settings_Apps');
    this._db = db;
    this._icRegistry = icRegistry;
  }

  /**
   * Returns an app configuration object
   * @param appName - Name of the app
   */
  async get(appName: string) {
    const collection = await lastValueFrom(
      this._db.getCollection<AppsSchema>(availableCollections.Apps),
    );
    const doc = await collection.data.findOne({ name: { $eq: appName } });
    return createFormattedValue(doc);
  }

  /**
   * Returns all installed apps
   */
  async getAll() {
    const collection = await lastValueFrom(
      this._db.getCollection<AppsSchema>(availableCollections.Apps),
    );
    const doc = await collection.data.find().toArray();
    return createFormattedValue(doc);
  }

  /**
   * Persist installed app configuration for the current user
   * @param app - Object
   */
  async install(app: { name?: string; id?: string }) {
    const release = await this._icRegistry.getLatestVersionInfo(app);
    const currentInfo = await this.get(release.data.name);
    if (currentInfo?.data?._id) {
      this._log.warn(`${app.name} already installed.`);
      return false;
    }
    if (!release?.data?.enabled) {
      this._log.warn(`${app.name} cannot be installed.`);
      return false;
    }
    const collection = await lastValueFrom(
      this._db.getCollection<AppsSchema>(availableCollections.Apps),
    );
    return collection.data.save({
      id: release.data.integrationID,
      name: release.data.name,
      integrationType: release.data.integrationType,
      version: release.data.version,
      sources: release.data.sources,
      status: true,
    });
  }

  /**
   * Uninstall app by name
   * @param appName - Name of the app
   */
  async uninstall(appName: string): Promise<void> {
    const collection = await lastValueFrom(
      this._db.getCollection<AppsSchema>(availableCollections.Settings),
    );
    const query: unknown = { name: { $eq: appName } };
    const doc = await collection.data.findOne(query);
    if (doc._id) {
      return collection.data.delete(doc._id);
    }
  }

  async toggleAppStatus(appName: string): Promise<boolean> {
    const collection = await lastValueFrom(
      this._db.getCollection<AppsSchema>(availableCollections.Settings),
    );
    const query: unknown = { name: { $eq: appName } };
    const doc = await collection.data.findOne(query);
    if (doc._id) {
      doc.status = !doc.status;
      await doc.save();
      return doc.status;
    }
  }

  async updateVersion(app: VersionInfo) {
    const release = await this._icRegistry.getIntegrationReleaseInfo(
      ethers.utils.id(`${app.name}${app.version}`),
    );
    const currentInfo = await this.get(release.data.name);
    if (!currentInfo?.data?._id) {
      this._log.warn(`${app.name} is not installed`);
      return false;
    }
    currentInfo.data.version = release.data.version;
    currentInfo.data.sources = release.data.sources;

    return currentInfo.data.save();
  }

  async updateConfig(app: ConfigInfo) {
    const currentInfo = await this.get(app.name);
    if (!currentInfo?.data?._id) {
      this._log.warn(`${app.name} is not installed`);
      return false;
    }
    currentInfo.data.config = app.config;
    return currentInfo.data.save();
  }
}

export default AppSettings;
