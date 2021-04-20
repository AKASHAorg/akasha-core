import { Client, ThreadID } from '@textile/hub';
import { ModerationReport } from './interfaces';

const schema = {
  title: 'ModerationReport',
  type: 'object',
  required: ['_id', 'contentType', 'contentId', 'author', 'reason'],
  properties: {
    _id: { type: 'string' },
    creationDate: { type: 'number' },
    contentType: { type: 'string' },
    contentId: { type: 'string' },
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
    path: 'contentId',
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
    name: 'ModerationReports',
  });
}

export async function updateCollection(client: Client, threadID: ThreadID) {
  return await client.updateCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'ModerationReports',
  });
}
