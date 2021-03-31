import { Client, ThreadID } from '@textile/hub';
import { PostItem } from './interfaces';

const schema = {
  title: 'Post',
  type: 'object',
  required: ['_id', 'content', 'creationDate', 'author'],
  properties: {
    _id: { type: 'string' },
    type: { type: 'string' },
    title: { type: 'string' },
    content: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'object',
        required: ['provider', 'property', 'value'],
        properties: {
          provider: { type: 'string' },
          property: { type: 'string' },
          value: { type: 'string' },
        },
      },
    },
    tags: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
      },
    },
    mentions: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
      },
    },
    quotes: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
      },
    },
    author: { type: 'string' },
    creationDate: { type: 'string' },
    metaData: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'object',
        required: ['provider', 'property', 'value'],
        properties: {
          provider: { type: 'string' },
          property: { type: 'string' },
          value: { type: 'string' },
        },
      },
    },
  },
};

const writeValidator = (writer: string, event: any, instance: PostItem) => {
  if (event.patch.type === 'delete') {
    if (writer === instance.author) {
      return true;
    }
  }
  return writer === 'bbaareihqdqd3me37e3pfs6pmy72cam7viai4lbcpxlqt365wicrnsi6q7e';
};

const readFilter = (reader: string, instance: PostItem) => {
  return instance;
};

const indexes = [
  {
    path: 'author',
    unique: false,
  },
  {
    path: 'title',
    unique: false,
  },
  {
    path: 'creationDate',
    unique: false,
  },
];
export async function newCollection(client: Client, threadID: ThreadID) {
  return await client.newCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'Posts',
  });
}

export async function updateCollection(client: Client, threadID: ThreadID) {
  return await client.updateCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'Posts',
  });
}
