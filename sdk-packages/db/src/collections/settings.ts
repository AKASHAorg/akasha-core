import { fromEntries } from '@akashaproject/sdk-core/lib/utils';
import {
  SettingsCollection,
  SettingsCollectionMethods,
  SettingsDoc,
  SettingsDocMethods,
} from '../collection.types/settings';
import settingsSchema from '../schemas/settings';

const settingsDocMethods: SettingsDocMethods = {
  getSettingsObject: function(this: SettingsDoc) {
    return fromEntries(this.services);
  },
};

const settingsCollectionMethods: SettingsCollectionMethods = {
  getAllSettings: async function(this: SettingsCollection) {
    return await this.find().exec();
  },
};

export default {
  name: 'settings',
  schema: settingsSchema,
  methods: settingsDocMethods,
  statics: settingsCollectionMethods,
};
