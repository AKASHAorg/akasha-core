import { injectable, inject } from 'inversify';
import ISettingsService from '@akashaproject/sdk-typings/lib/interfaces/settings';
import { TYPES } from '@akashaproject/sdk-typings';
import DB, { availableCollections } from '../db';
import { exhaustMap, switchMap } from 'rxjs/operators';
import { createObservableStream } from '../helpers/observable';
import { ServiceCallResult } from '@akashaproject/sdk-typings/lib/interfaces';
import { lastValueFrom } from 'rxjs';
import { Collection } from '@textile/threaddb';
import { SettingsSchema } from '../db/settings.schema';

@injectable()
class Settings implements ISettingsService {
  @inject(TYPES.Db) private _db: DB;

  /**
   * Returns the settings object for a specified service name
   * @param service - The service name
   */
  get(service: string) {
    return this._db.getCollection(availableCollections.Settings).pipe(
      switchMap((collection: { data: Collection<SettingsSchema> }) => {
        // this does not play well with threaddb typings
        const query: unknown = { serviceName: { $eq: service } };
        const doc = collection.data.findOne(query);
        return createObservableStream(doc);
      }),
    );
  }

  /**
   *
   * @param service - The service name
   * @param options - Array of option pairs [optionName, value]
   * @returns ServiceCallResult
   */
  set(service: string, options: [[string, unknown]]): ServiceCallResult<string[]> {
    return this.get(service).pipe(
      exhaustMap(settings => {
        const objToSave = {
          _id: settings?.data?._id || '',
          serviceName: service,
          options: options,
        };
        return this._db.getCollection(availableCollections.Settings).pipe(
          switchMap(collection => {
            return createObservableStream(collection.data.save(objToSave));
          }),
        );
      }),
    );
  }

  async remove(serviceName: string): Promise<void> {
    const collection = await lastValueFrom(this._db.getCollection(availableCollections.Settings));
    const query: unknown = { serviceName: { $eq: serviceName } };
    const doc = await collection.data.findOne(query);
    if (doc._id) {
      return await collection.data.delete(doc._id);
    }
  }
}

export default Settings;
