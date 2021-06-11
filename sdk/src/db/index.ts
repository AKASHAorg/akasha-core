import { injectable } from 'inversify';
import DBService from '@akashaproject/sdk-typings/lib/interfaces/db';
import { Collection, Database } from '@textile/threaddb';
import settingsSchema from './settings.schema';
import appSchema from './app.schema';
import { createObservableStream, createObservableValue } from '../helpers/observable';
import { ObservableCallResult } from '@akashaproject/sdk-typings/lib/interfaces';

export const availableCollections = Object.freeze({
  Settings: settingsSchema.name,
  Apps: appSchema.name,
});

@injectable()
class DB implements DBService<Database, Collection> {
  private _dbName: string;
  private readonly _db: Database;
  private _opened = false;
  private static NOT_OPENED_ERROR = new Error('Database is closed, must call open() first');
  constructor(name: string) {
    this._dbName = name;
    this._db = new Database(name, settingsSchema, appSchema);
  }

  public open(version = 1): ObservableCallResult<Database> {
    if (!this._opened) {
      this._opened = true;
      return createObservableStream<Database>(this._db.open(version));
    }
    return createObservableValue<Database>(this._db);
  }

  public getDb(): ObservableCallResult<Database> {
    if (!this._opened) {
      throw DB.NOT_OPENED_ERROR;
    }
    return createObservableValue<Database>(this._db);
  }

  getCollection(
    name: typeof availableCollections[keyof typeof availableCollections],
  ): ObservableCallResult<Collection> {
    if (!this._opened) {
      throw DB.NOT_OPENED_ERROR;
    }
    return createObservableValue<Collection>(this._db.collection(name));
  }
}

export { DB };
