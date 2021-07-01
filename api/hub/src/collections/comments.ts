import { Client, ThreadID } from '@textile/hub';
import { Comment } from './interfaces';

const schema = {
  title: 'Comment',
  type: 'object',
  required: ['_id', 'author', 'creationDate', 'content', 'postId'],
  properties: {
    _id: { type: 'string' },
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
    author: { type: 'string' },
    replyTo: { type: 'string' },
    creationDate: { type: 'number' },
    updatedAt: { type: 'number' },
    postId: { type: 'string' },
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

const writeValidator = (writer: string, event: any, instance: Comment) => {
  if (event.patch.type === 'delete') {
    if (writer === instance.author) {
      return true;
    }
  }
  return writer === 'bbaareihqdqd3me37e3pfs6pmy72cam7viai4lbcpxlqt365wicrnsi6q7e';
};

const readFilter = (reader: string, instance: Comment) => {
  return instance;
};

const indexes = [
  {
    path: 'postId',
    unique: false,
  },
  {
    path: 'author',
    unique: false,
  },
  {
    path: 'replyTo',
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
    name: 'Comments',
  });
}

export async function updateCollection(client: Client, threadID: ThreadID) {
  return await client.updateCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'Comments',
  });
}
