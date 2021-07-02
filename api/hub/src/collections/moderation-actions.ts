import { Client, ThreadID } from '@textile/hub';
import { ModerationAction } from './interfaces';

const schema = {
  title: 'ModerationAction',
  type: 'object',
  required: ['_id', 'contentID'],
  properties: {
    _id: { type: 'string' },
    contentID: { type: 'string' },
    moderator: { type: 'string' },
    moderatedDate: { type: 'number' },
    explanation: { type: 'string' },
    delisted: { type: 'boolean' },
  },
};

const writeValidator = (writer: string, event: any, instance: ModerationAction) => {
  return writer === 'bbaareihqdqd3me37e3pfs6pmy72cam7viai4lbcpxlqt365wicrnsi6q7e';
};

const readFilter = (reader: string, instance: ModerationAction) => {
  return instance;
};

const indexes = [
  {
    path: 'contentID',
    unique: false,
  },
  {
    path: 'moderatedDate',
    unique: false,
  },
  {
    path: 'moderator',
    unique: false,
  },
];
export function newCollection(client: Client, threadID: ThreadID) {
  return client.newCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'ModerationActions',
  });
}

export function updateCollection(client: Client, threadID: ThreadID) {
  return client.updateCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'ModerationActions',
  });
}
