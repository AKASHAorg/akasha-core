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
        items: {
          type: 'string',
        },
      },
    },
  },
};

export default {
  name: 'SETTINGS',
  schema: schema,
};
