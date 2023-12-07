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
import IcRegistry from '../registry/icRegistry';
import { ethers, id } from 'ethers';
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
  private _icRegistry: IcRegistry;
  private _globalChannel: EventBus;

  constructor(
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Db) db: DB,
    @inject(TYPES.ICRegistry) icRegistry: IcRegistry,
    @inject(TYPES.EventBus) globalChannel: EventBus,
  ) {
    this._log = log.create('AWF_Settings_Apps');
    this._db = db;
    this._icRegistry = icRegistry;
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
    const collection = this._db.getCollections().integrations;
    if (isLocal && __DEV__) {
      // @TODO: find a way to avoid handling local apps here

      this._globalChannel.next({
        data: { name: app.name, id: app.id },
        event: APP_EVENTS.INFO_READY,
      });
      return collection?.put({
        integrationType: 0,
        sources: undefined,
        status: false,
        version: '@local',
        name: app.name,
        id: app.name,
      });
    }
    const release = await this._icRegistry.getLatestVersionInfo(app);
    const currentInfo = await this.get(release.name);
    if (currentInfo?.data?.name) {
      this._log.warn(`${app.name} already installed.`);
      return false;
    }
    if (!release?.enabled) {
      this._log.warn(`${app.name} cannot be installed.`);
      return false;
    }

    const integrationInfo = {
      id: release.integrationID,
      name: release.name,
      integrationType: release.integrationType,
      version: release.version,
      sources: release.sources,
      status: true,
    };
    this._globalChannel.next({
      data: integrationInfo,
      event: APP_EVENTS.INFO_READY,
    });
    return collection?.put(integrationInfo);
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
    const release = await this._icRegistry.getIntegrationReleaseInfo(
      id(`${app.name}${app.version}`),
    );
    const currentInfo = await this.get(release.name);
    const collection = this._db.getCollections().integrations;
    if (!currentInfo?.data?.id) {
      this._log.warn(`${app.name} is not installed`);
      return false;
    }
    currentInfo.data.version = release.version;
    currentInfo.data.sources = release.sources;
    this._globalChannel.next({
      data: {
        status: currentInfo.data.status,
        name: app.name,
        version: currentInfo.data.version,
        sources: currentInfo.data.sources,
        integrationType: currentInfo.data.integrationType,
      },
      event: APP_EVENTS.UPDATE_VERSION,
    });
    return collection?.where('id').equals(currentInfo.data.id).modify(currentInfo.data);
  }

  async updateConfig(app: ConfigInfo) {
    const currentInfo = await this.get(app.name);
    const collection = this._db.getCollections().integrations;
    if (!currentInfo?.data?.id) {
      this._log.warn(`${app.name} is not installed`);
      return false;
    }
    currentInfo.data.config = app.config;
    this._globalChannel.next({
      data: {
        name: app.name,
        config: app.config,
      },
      event: APP_EVENTS.UPDATE_CONFIG,
    });

    return collection?.where('id').equals(currentInfo.data.id).modify(currentInfo.data);
  }
}

export default AppSettings;
