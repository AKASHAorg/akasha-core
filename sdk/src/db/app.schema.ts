import { JSONSchema } from '@textile/threaddb';

export const schema: JSONSchema = {
  title: 'Apps',
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    source: {
      type: 'string',
    },
    info: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'array',
      },
    },
  },
};

export interface AppsSchema {
  name: string;
  source?: string;
  info?: string[][];
}

export default {
  name: 'APPS',
  schema: schema,
};
