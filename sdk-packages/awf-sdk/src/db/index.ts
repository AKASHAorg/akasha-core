import { injectable } from 'inversify';
import DBService from '@akashaproject/sdk-typings/lib/interfaces/db';
import { Collection, Database } from '@textile/threaddb';
import { ObservableCallResult } from '@akashaproject/sdk-typings/lib/interfaces/basic';
import settingsSchema from './settings.schema';
import { createObservableStream, createObservableValue } from '../helpers/observable';

@injectable()
class DB implements DBService {
  private _dbName: string;
  private readonly _db: Database;
  private _opened = false;
  constructor(name: string) {
    this._dbName = name;
    this._db = new Database(name, settingsSchema);
  }

  public open(version = 1): ObservableCallResult<Database> {
    if (!this._opened) {
      this._opened = true;
      return createObservableStream(this._db.open(version));
    }
    return createObservableValue(this._db);
  }

  public getDb(): ObservableCallResult<Database> {
    return createObservableValue(this._db);
  }

  getCollection(name: string): ObservableCallResult<Collection> {
    return createObservableValue(this._db.collection(name));
  }
}

export { DB };
