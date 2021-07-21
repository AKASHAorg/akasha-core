import { Client, ThreadID } from '@textile/hub';
import { ModerationReason } from './interfaces';

const schema = {
  title: 'ModerationReason',
  type: 'object',
  required: ['_id', 'label', 'description', 'active'],
  properties: {
    _id: { type: 'string' },
    creationDate: { type: 'number' },
    label: { type: 'string' },
    description: { type: 'string' },
    active: { type: 'boolean' },
  },
};

const writeValidator = (writer: string, event: any, instance: ModerationReason) => {
  return writer === 'bbaareihqdqd3me37e3pfs6pmy72cam7viai4lbcpxlqt365wicrnsi6q7e';
};

const readFilter = (reader: string, instance: ModerationReason) => {
  return instance;
};

const indexes = [
  {
    path: 'label',
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
    name: 'ModerationReasons',
  });
}

export function updateCollection(client: Client, threadID: ThreadID) {
  return client.updateCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'ModerationReasons',
  });
}
