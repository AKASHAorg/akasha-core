import { inject, injectable } from 'inversify';
import { TYPES } from '@akashaproject/sdk-typings';
import DB, { availableCollections } from '../db';
import { exhaustMap, switchMap } from 'rxjs/operators';
import { createObservableStream } from '../helpers/observable';
import { lastValueFrom, of } from 'rxjs';
import { Collection } from '@textile/threaddb';
import { AppsSchema } from '../db/app.schema';
import Logging from '../logging/index';
import { ILogger } from '@akashaproject/sdk-typings/src/interfaces/log';
import { IAppSettings } from '@akashaproject/sdk-typings/src/interfaces/settings';

@injectable()
class AppSettings implements IAppSettings {
  private _db: DB;
  private _log: ILogger;

  constructor(@inject(TYPES.Log) log: Logging, @inject(TYPES.Db) db: DB) {
    this._log = log.create('AWF_Settings_Apps');
    this._db = db;
  }

  /**
   * Returns an app configuration object
   * @param appName - Name of the app
   */
  get(appName: string) {
    return this._db.getCollection(availableCollections.Apps).pipe(
      switchMap((collection: { data: Collection<AppsSchema> }) => {
        const doc = collection.data.findOne({ name: { $eq: appName } });
        return createObservableStream(doc);
      }),
    );
  }

  /**
   * Returns all installed apps
   */
  getAll() {
    return this._db.getCollection(availableCollections.Apps).pipe(
      switchMap((collection: { data: Collection<AppsSchema> }) => {
        const doc = collection.data.find().toArray();
        return createObservableStream(doc);
      }),
    );
  }

  /**
   * Persist installed app configuration for the current user
   * @param app - Object
   */
  install(app: AppsSchema) {
    return this.get(app.name).pipe(
      exhaustMap(result => {
        if (result?.data?._id) {
          this._log.warn(`${app.name} already installed`);
          return of(false);
        }
        return this._db.getCollection(availableCollections.Apps).pipe(
          switchMap(collection => {
            return createObservableStream(collection.data.save(app));
          }),
        );
      }),
    );
  }

  /**
   * Uninstall app by name
   * @param appName - Name of the app
   */
  async uninstall(appName: string): Promise<void> {
    const collection = await lastValueFrom(this._db.getCollection(availableCollections.Settings));
    const query: unknown = { name: { $eq: appName } };
    const doc = await collection.data.findOne(query);
    if (doc._id) {
      return await collection.data.delete(doc._id);
    }
  }
}

export default AppSettings;
