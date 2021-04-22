import { Client, ThreadID } from '@textile/hub';
import { Moderator } from './interfaces';

const schema = {
  title: 'Moderator',
  type: 'object',
  required: ['_id', 'address', 'admin', 'active'],
  properties: {
    _id: { type: 'string' },
    creationDate: { type: 'number' },
    ethAddress: { type: 'string' },
    admin: { type: 'boolean' },
    active: { type: 'boolean' },
  },
};

const writeValidator = (writer: string, event: any, instance: Moderator) => {
  return writer === 'bbaareihqdqd3me37e3pfs6pmy72cam7viai4lbcpxlqt365wicrnsi6q7e';
};

const readFilter = (reader: string, instance: Moderator) => {
  return instance;
};

const indexes = [
  {
    path: 'ethAddress',
    unique: true,
  },
  {
    path: 'creationDate',
    unique: false,
  },
];
export function newCollection(client: Client, threadID: ThreadID) {
  return client.newCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'Moderators',
  });
}

export function updateCollection(client: Client, threadID: ThreadID) {
  return client.updateCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'Moderators',
  });
}
