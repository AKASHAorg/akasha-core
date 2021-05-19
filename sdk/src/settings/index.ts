import { injectable, inject } from 'inversify';
import ISettingsService from '@akashaproject/sdk-typings/lib/interfaces/settings';
import { TYPES } from '@akashaproject/sdk-typings';
import { availableCollections, DB } from '../db';
import { exhaustMap, switchMap } from 'rxjs/operators';
import { createObservableStream } from '../helpers/observable';
import { ServiceCallResult } from '@akashaproject/sdk-typings/lib/interfaces';

@injectable()
class Settings implements ISettingsService {
  @inject(TYPES.Db) private _db: DB;

  /**
   * Returns the settings object for a specified service name
   * @param service - The service name
   */
  get(service: typeof availableCollections[keyof typeof availableCollections]) {
    return this._db.getCollection(availableCollections.Settings).pipe(
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
   * @returns ServiceCallResult<string[]>
   */
  set(service: string, options: [[string, unknown]]): ServiceCallResult<string[]> {
    return this.get(service).pipe(
      exhaustMap(settings => {
        const objToSave = {
          _id: settings?.data?._id || '',
          service: service,
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
  remove(moduleName: string): void {
    throw new Error('Method not implemented.');
  }
}
export { Settings };
