import { Client, ThreadID } from '@textile/hub';
import { Tag } from './interfaces';

const schema = {
  title: 'Tag',
  type: 'object',
  required: ['_id', 'name'],
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    creationDate: { type: 'number' },
  },
};

const writeValidator = (writer: string, event: any, instance: Tag) => {
  if (instance.name.toLowerCase() !== instance.name) {
    return false;
  }
  return writer === 'bbaareihqdqd3me37e3pfs6pmy72cam7viai4lbcpxlqt365wicrnsi6q7e';
};

const readFilter = (reader: string, instance: Tag) => {
  return instance;
};

const indexes = [
  {
    path: 'name',
    unique: true,
  },
];
export async function newCollection(client: Client, threadID: ThreadID) {
  return await client.newCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'Tags',
  });
}

export async function updateCollection(client: Client, threadID: ThreadID) {
  return await client.updateCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'Tags',
  });
}
