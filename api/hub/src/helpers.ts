import { createAPISig, Client, ThreadID, PrivateKey } from '@textile/hub';
import { updateCollections, initCollections } from './collections';

export const getAPISig = async (minutes: number = 30) => {
  const expiration = new Date(Date.now() + 1000 * 60 * minutes);
  return await createAPISig(process.env.USER_GROUP_API_SECRET, expiration);
};

let userDBClient;
export const newClientDB = async () => {
  if (userDBClient) {
    return userDBClient;
  }
  const API = process.env.API || undefined;
  const client = await Client.withKeyInfo(
    {
      key: process.env.USER_GROUP_API_KEY,
      secret: process.env.USER_GROUP_API_SECRET,
    },
    API,
    process.env.NODE_ENV !== 'production',
  );
  userDBClient = client;
  return client;
};

let appDBClient;
export const initAppDB = async () => {
  if (appDBClient) {
    return appDBClient;
  }
  const API = process.env.API || undefined;
  const client = await Client.withKeyInfo(
    {
      key: process.env.APP_API_KEY,
      secret: process.env.APP_API_SECRET,
    },
    API,
    process.env.NODE_ENV !== 'production',
  );
  const identity = PrivateKey.fromString(process.env.AWF_DBkey);
  await client.getToken(identity);
  appDBClient = client;
  return client;
};

export const setupDBCollections = async () => {
  const appDB = await initAppDB();
  const threadID = process.env.AWF_THREADdb
    ? ThreadID.fromString(process.env.AWF_THREADdb)
    : ThreadID.fromRandom();

  if (!process.env.AWF_DBname && !process.env.AWF_THREADdb) {
    await appDB.newDB(threadID, 'defaultDB');
  }

  await initCollections(appDB, threadID);
  await updateCollections(appDB, threadID);
  return { threadID, client: appDB };
};
