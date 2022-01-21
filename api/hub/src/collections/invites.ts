import { Client, ThreadID } from '@textile/hub';

const schema = {
  title: 'Invite',
  type: 'object',
  required: ['_id', 'name'],
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    updateDate: { type: 'number' },
    used: { type: 'boolean' },
  },
};

const writeValidator = (writer: string) => {
  return writer === 'bbaareihqdqd3me37e3pfs6pmy72cam7viai4lbcpxlqt365wicrnsi6q7e';
};

const readFilter = (reader: string, instance: unknown) => {
  return instance;
};

const indexes = [
  {
    path: 'name',
    unique: true,
  },
];
export async function newCollection(client: Client, threadID: ThreadID) {
  return client.newCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'Invites',
  });
}

export async function updateCollection(client: Client, threadID: ThreadID) {
  return client.updateCollection(threadID, {
    schema,
    writeValidator,
    readFilter,
    indexes,
    name: 'Invites',
  });
}
