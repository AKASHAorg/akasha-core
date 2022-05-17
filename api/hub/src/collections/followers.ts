import { Client, ThreadID } from '@textile/hub';
import { Event } from '@textile/threads-client';
import { Follower } from './interfaces';

const schema = {
  title: 'Followers',
  type: 'object',
  required: ['_id', 'follower', 'following', 'active', 'creationDate'],
  properties: {
    _id: { type: 'string' },
    follower: { type: 'string' },
    following: { type: 'string' },
    active: { type: 'boolean' },
    creationDate: { type: 'number' },
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

const writeValidator = (writer: string, event: Event, instance: Follower) => {
  if (event.patch.type === 'delete') {
    if (writer === instance.follower) {
      return true;
    }
  }
  return writer === 'bbaareihqdqd3me37e3pfs6pmy72cam7viai4lbcpxlqt365wicrnsi6q7e';
};

const readFilter = (reader: string, instance: Follower) => {
  return instance;
};

const indexes = [];
export async function newCollection(client: Client, threadID: ThreadID) {
  return client.newCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'Followers',
  });
}

export async function updateCollection(client: Client, threadID: ThreadID) {
  return client.updateCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'Followers',
  });
}
