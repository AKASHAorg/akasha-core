import { injectable } from 'inversify';
import { Collection, Database } from '@textile/threaddb';
import settingsSchema from './settings.schema';
import appSchema from './app.schema';
import { validate } from '../common/validator';
import { z } from 'zod';

export const availableCollections = Object.freeze({
  Settings: settingsSchema.name,
  Apps: appSchema.name,
});

@injectable()
class DB {
  private _dbName: string | null;
  private _db: Database | null;
  private _opened = false;
  private static NOT_OPENED_ERROR = new Error('Database is closed, must call open() first');
  constructor() {
    this._dbName = null;
    this._db = null;
  }
  /**
   * Create a new DB instance
   * @param name - database name
   */
  @validate(z.string())
  public create(name: string) {
    this._dbName = name;
    this._db = new Database(name, settingsSchema, appSchema);
    return this._db;
  }

  /**
   *
   * @param version - number representing the db version
   */
  @validate(z.number().positive().int('version parameter must be an integer'))
  public async open(version = 1): Promise<Database> {
    if (!this._db) {
      throw new Error('Must call `DB:create` first');
    }

    if (!this._opened) {
      this._opened = true;
      return this._db.open(version);
    }
    return this._db;
  }

  /**
   * Get access to the local db
   */
  public async getDb(): Promise<Database> {
    this._ensureDbOpened();
    if (!this._db) {
      throw new Error('Must call `DB:create` first');
    }
    return this._db;
  }

  /**
   * Get access to the db collection by name
   * @param name - string representing the collection name
   */
  @validate(
    z.string().refine(name => Object.values(availableCollections).includes(name), {
      message: 'Invalid collection name',
    }),
  )
  public getCollection<T>(
    name: typeof availableCollections[keyof typeof availableCollections],
  ): Collection<T> {
    this._ensureDbOpened();
    if (!this._db) {
      throw new Error('Must call `DB:create` first');
    }
    const collection = this._db.collection(name);
    if (!collection) {
      throw new Error('Collection not found');
    }
    return collection as Collection<T>;
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
