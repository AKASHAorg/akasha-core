export const schema: any = {
  title: 'Settings',
  type: 'object',
  properties: {
    serviceName: {
      type: 'string',
    },
    options: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'array',
      },
    },
  },
};

export interface SettingsSchema {
  serviceName: string;
  options: string[][];
}
export default {
  name: 'SETTINGS',
  schema: schema,
};
