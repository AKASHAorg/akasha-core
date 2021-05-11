import { Client, ThreadID } from '@textile/hub';
import { ModerationDecision } from './interfaces';

const schema = {
  title: 'ModerationDecision',
  type: 'object',
  required: ['_id', 'contentType', 'contentID'],
  properties: {
    _id: { type: 'string' },
    creationDate: { type: 'number' },
    contentType: { type: 'string' },
    contentID: { type: 'string' },
    moderator: { type: 'string' },
    moderatedDate: { type: 'number' },
    explanation: { type: 'string' },
    delisted: { type: 'boolean' },
    moderated: { type: 'boolean' },
  },
};

const writeValidator = (writer: string, event: any, instance: ModerationDecision) => {
  return writer === 'bbaareihqdqd3me37e3pfs6pmy72cam7viai4lbcpxlqt365wicrnsi6q7e';
};

const readFilter = (reader: string, instance: ModerationDecision) => {
  return instance;
};

const indexes = [
  {
    path: 'contentID',
    unique: true,
  },
  {
    path: 'creationDate',
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
    name: 'ModerationDecisions',
  });
}

export function updateCollection(client: Client, threadID: ThreadID) {
  return client.updateCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'ModerationDecisions',
  });
}
