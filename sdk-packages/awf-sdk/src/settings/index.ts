import { injectable, inject } from 'inversify';
import ISettingsService from '@akashaproject/sdk-typings/lib/interfaces/settings';
import { TYPES } from '@akashaproject/sdk-typings';
import { availableCollections, DB } from '../db';
import { exhaustMap, switchMap } from 'rxjs/operators';
import { createObservableStream } from '../helpers/observable';

@injectable()
class Settings implements ISettingsService {
  @inject(TYPES.Db) private _db: DB;

  get(service: typeof availableCollections[keyof typeof availableCollections]) {
    return this._db.getCollection(availableCollections.Settings).pipe(
      switchMap(collection => {
        // this does not play well with threaddb typings
        const query: any = { serviceName: { $eq: service } };
        const doc = collection.data.findOne(query);
        return createObservableStream(doc);
      }),
    );
  }

  set(service: string, options: string[][]) {
    return this.get(service).pipe(
      exhaustMap(settings => {
        const objToSave = {
          _id: settings.data?._id || '',
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
