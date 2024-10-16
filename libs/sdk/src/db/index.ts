import { injectable } from 'inversify';
import settingsSchema from './settings.schema';
import installedExtensionSchema from './installed-extensions.schema';
import { validate } from '../common/validator';
import { z } from 'zod';
import DbWrapper from './db.wrapper';

export const availableCollections = Object.freeze({
  Settings: settingsSchema.name,
  InstalledExtensions: installedExtensionSchema.name,
});

@injectable()
class DB {
  private _dbName: string;
  private _db: DbWrapper | undefined;
  private static NOT_OPENED_ERROR = new Error('Database is closed, must call create() first');

  constructor() {
    this._dbName = '';
    this._db = undefined;
  }

  /**
   * Create a new DB instance
   * @param name - database name
   */
  @validate(z.string())
  public create(name: string) {
    this._dbName = name;
    this._db = new DbWrapper(name);
    return this._db;
  }

  /**
   * Get access to the local db
   */
  public async getDb(): Promise<DbWrapper> {
    this._ensureDbOpened();
    if (!this._db) {
      throw new Error('Must call `DB:create` first');
    }
    return this._db;
  }

  public getCollections() {
    return {
      installedExtensions: this._db?.installedExtensions,
      settings: this._db?.settings,
    };
  }

  /**
   * Throws an error is the local db is not opened
   */
  private _ensureDbOpened() {
    if (!this._db) {
      throw DB.NOT_OPENED_ERROR;
    }
  }
}

export default DB;
