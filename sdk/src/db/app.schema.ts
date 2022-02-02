import { JSONSchema } from '@textile/threaddb';

export const schema: JSONSchema = {
  title: 'Integrations',
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    id: {
      type: 'string',
    },
    integrationType: {
      type: 'number',
    },
    version: {
      type: 'string',
    },
    sources: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
      },
    },
    status: {
      type: 'boolean',
    },
    config: {
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
  id: string;
  integrationType: number;
  version: string;
  sources: string[];
  status: boolean;
  config?: string[][];
}

export default {
  name: 'Integrations',
  schema: schema,
};
