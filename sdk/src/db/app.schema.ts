import { JSONSchema } from '@textile/threaddb';
import { ReleaseInfo } from '@akashaorg/typings/sdk';

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

// @TODO: this should be replaced with some generated types. Which one?
export interface AppsSchema {
  name: string;
  id: string;
  integrationType: number;
  version: string;
  sources: ReleaseInfo['sources'];
  status: boolean;
  config?: string[][];
}

export default {
  name: 'Integrations',
  schema: schema,
};
