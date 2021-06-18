import { injectable } from 'inversify';
import DBService from '@akashaproject/sdk-typings/src/interfaces/db';
import { Collection, Database } from '@textile/threaddb';
import settingsSchema from './settings.schema';
import appSchema from './app.schema';
import { createObservableStream, createObservableValue } from '../helpers/observable';
import { ServiceCallResult } from '@akashaproject/sdk-typings/src/interfaces';

export const availableCollections = Object.freeze({
  Settings: settingsSchema.name,
  Apps: appSchema.name,
});

@injectable()
class DB implements DBService<Database, Collection> {
  private _dbName: string;
  private _db: Database;
  private _opened = false;
  private static NOT_OPENED_ERROR = new Error('Database is closed, must call open() first');

  /**
   * Create a new DB instance
   * @param name
   * @returns Database
   */
  public create(name: string) {
    this._dbName = name;
    this._db = new Database(name, settingsSchema, appSchema);
    return this._db;
  }

  /**
   *
   * @param version - number representing the db version
   * @returns ServiceCallResult<Database>
   */
  public open(version = 1): ServiceCallResult<Database> {
    if (!this._db) {
      throw new Error('Must call `DB:create` first');
    }

    if (!this._opened) {
      this._opened = true;
      return createObservableStream<Database>(this._db.open(version));
    }
    return createObservableValue<Database>(this._db);
  }

  /**
   * Get access to the local db
   * @returns ServiceCallResult<Database>
   */
  public getDb(): ServiceCallResult<Database> {
    this._ensureDbOpened();
    return createObservableValue<Database>(this._db);
  }

  /**
   * Get access to the db collection by name
   * @param name - string representing the collection name
   * @returns ServiceCallResult<Collection>
   */
  public getCollection(
    name: typeof availableCollections[keyof typeof availableCollections],
  ): ServiceCallResult<Collection> {
    this._ensureDbOpened();
    return createObservableValue<Collection>(this._db.collection(name));
  }

  /**
   * Throws an error is the local db is not opened
   */
  private _ensureDbOpened() {
    if (!this._opened) {
      throw DB.NOT_OPENED_ERROR;
    }
  }
}

export default DB;
