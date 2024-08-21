import { injectable, inject } from 'inversify';
import { TYPES } from '@akashaorg/typings/lib/sdk';
import DB from '../db';
import { createFormattedValue } from '../helpers/observable';
import { validate } from '../common/validator';
import { z } from 'zod';

@injectable()
class Settings {
  constructor(@inject(TYPES.Db) private _db: DB) {}

  /**
   * Returns the settings object for a specified service name
   * @param service - The service name
   */
  @validate(z.string())
  async get(service: string) {
    const collection = this._db.getCollections().settings;
    const doc = await collection?.where('serviceName').equals(service).first();
    return createFormattedValue(doc);
  }

  /**
   *
   * @param service - The service name
   * @param options - Array of option pairs [optionName, value]
   * @returns ServiceCallResult
   */
  @validate(z.string(), z.array(z.tuple([z.string(), z.string().or(z.number()).or(z.boolean())])))
  async set(
    service: string,
    options: [[string, string | number | boolean]],
  ): Promise<{ data: string[] }> {
    const doc = await this.get(service);
    const objToSave = {
      id: doc?.data?.id || '',
      serviceName: service,
      options: options,
    };
    const collection = this._db.getCollections().settings;
    let saveResult;
    if (objToSave.id) {
      saveResult = await collection?.where('id').equals(objToSave.id).modify(objToSave);
    } else {
      saveResult = await collection?.put({ serviceName: service, options: options });
    }

    return createFormattedValue(saveResult);
  }

  @validate(z.string())
  async remove(serviceName: string): Promise<void> {
    const collection = this._db.getCollections().settings;
    await collection?.where('name').equals(serviceName).delete();
  }
}

export default Settings;
