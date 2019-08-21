import { fromEntries } from '@akashaproject/sdk-core/lib/utils';
import {
  SettingsCollection,
  SettingsCollectionMethods,
  SettingsDoc,
  SettingsDocMethods,
} from '../collection.types/settings';
import settingsSchema from '../schemas/settings';

const settingsDocMethods: SettingsDocMethods = {
  getSettingsObject(this: SettingsDoc) {
    return fromEntries(this.services);
  },
};

const settingsCollectionMethods: SettingsCollectionMethods = {
  async getAllSettings(this: SettingsCollection, ethAddress: string) {
    return await this.find()
      .where('ethAddress')
      .equals(ethAddress)
      .exec();
  },
};

export default {
  name: 'settings',
  schema: settingsSchema,
  methods: settingsDocMethods,
  statics: settingsCollectionMethods,
};
