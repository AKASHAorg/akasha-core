export const settingsSchema: any = {
  title: 'Settings',
  type: 'object',
  properties: {
    pubKey: {
      type: 'string',
    },
    moduleName: {
      type: 'string',
    },
    services: {
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
