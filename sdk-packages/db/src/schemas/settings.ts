import { RxJsonSchema } from 'rxdb';
import { SettingsDocType } from '../collection.types/settings';

const settingsSchema: RxJsonSchema<SettingsDocType> = {
  title: 'settings schema',
  description: 'contains all the application settings for each ethAddress',
  version: 0,
  type: 'object',

  properties: {
    ethAddress: {
      type: 'string',
      index: true,
    },
    moduleName: {
      type: 'string',
    },
    services: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'array',
        maxItems: 2,
        minItems: 2,
        items: {
          type: 'string',
          encrypted: true,
        },
      },
    },
  },
};

export default settingsSchema;
