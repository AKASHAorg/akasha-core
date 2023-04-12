import { injectable, inject } from 'inversify';
import { TYPES } from '@akashaorg/typings/sdk';
import DB, { availableCollections } from '../db';
import { SettingsSchema } from '../db/settings.schema';
import { createFormattedValue } from '../helpers/observable';
import { validate } from "../common/validator";
import { z } from "zod";

@injectable()
class Settings {
  constructor(@inject(TYPES.Db) private _db: DB) {}
  /**
   * Returns the settings object for a specified service name
   * @param service - The service name
   */
  @validate(z.string())
  async get<T>(service: string) {
    const collection = this._db.getCollection<SettingsSchema<T>>(availableCollections.Settings);
    const query = {
      serviceName: { $eq: service },
    };
    const doc = await collection.findOne(query);
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
      _id: doc?.data?._id || '',
      serviceName: service,
      options: options,
    };
    const collection = this._db.getCollection<SettingsSchema<typeof options>>(
      availableCollections.Settings,
    );
    const saveResult = await collection.save(objToSave);
    return createFormattedValue(saveResult);
  }

  @validate(z.string())
  async remove(serviceName: string): Promise<void> {
    const collection = this._db.getCollection<SettingsSchema<unknown>>(
      availableCollections.Settings,
    );
    const query = { serviceName: { $eq: serviceName } };
    const doc = await collection.findOne(query);
    if (doc && doc._id) {
      return collection.delete(doc._id);
    }
  }
}

export default Settings;
