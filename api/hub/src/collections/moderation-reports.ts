import { Client, ThreadID } from '@textile/hub';
import { ModerationReport } from './interfaces';

const schema = {
  title: 'ModerationReport',
  type: 'object',
  required: ['_id', 'contentType', 'contentID', 'author', 'reason'],
  properties: {
    _id: { type: 'string' },
    creationDate: { type: 'number' },
    contentType: { type: 'string' },
    contentID: { type: 'string' },
    author: { type: 'string' },
    reason: { type: 'string' },
    explanation: { type: 'string' },
  },
};

const writeValidator = (writer: string, event: any, instance: ModerationReport) => {
  return writer === 'bbaareihqdqd3me37e3pfs6pmy72cam7viai4lbcpxlqt365wicrnsi6q7e';
};

const readFilter = (reader: string, instance: ModerationReport) => {
  return instance;
};

const indexes = [
  {
    path: 'contentID',
    unique: false,
  },
  {
    path: 'creationDate',
    unique: false,
  },
  {
    path: 'author',
    unique: false,
  },
];
export function newCollection(client: Client, threadID: ThreadID) {
  return client.newCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'ModerationReports',
  });
}

export function updateCollection(client: Client, threadID: ThreadID) {
  return client.updateCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'ModerationReports',
  });
}
