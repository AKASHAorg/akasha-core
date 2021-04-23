export const schema: any = {
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
        items: {
          type: 'string',
        },
      },
    },
  },
};

export default {
  name: 'APPS',
  schema: schema,
};
