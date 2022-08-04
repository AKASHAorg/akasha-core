import { injectable, inject } from 'inversify';
import { ServiceCallResult, TYPES, ISettingsService } from '@akashaorg/typings/sdk';
import DB, { availableCollections } from '../db';
import { exhaustMap, switchMap } from 'rxjs/operators';
import { createObservableStream } from '../helpers/observable';
import { lastValueFrom } from 'rxjs';
import { SettingsSchema } from '../db/settings.schema';

@injectable()
class Settings implements ISettingsService {
  @inject(TYPES.Db) private _db: DB;

  /**
   * Returns the settings object for a specified service name
   * @param service - The service name
   */
  get<T>(service: string) {
    return this._db.getCollection<SettingsSchema<T>>(availableCollections.Settings).pipe(
      switchMap(collection => {
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
  set(
    service: string,
    options: [[string, string | number | boolean]],
  ): ServiceCallResult<string[]> {
    return this.get(service).pipe(
      exhaustMap(settings => {
        const objToSave = {
          _id: settings?.data?._id || '',
          serviceName: service,
          options: options,
        };
        return this._db
          .getCollection<SettingsSchema<typeof options>>(availableCollections.Settings)
          .pipe(
            switchMap(collection => {
              return createObservableStream(collection.data.save(objToSave));
            }),
          );
      }),
    );
  }

  async remove(serviceName: string): Promise<void> {
    const collection = await lastValueFrom(
      this._db.getCollection<SettingsSchema<unknown>>(availableCollections.Settings),
    );
    const query: unknown = { serviceName: { $eq: serviceName } };
    const doc = await collection.data.findOne(query);
    if (doc._id) {
      return collection.data.delete(doc._id);
    }
  }
}

export default Settings;
