import {
  createAPISig,
  Client,
  ThreadID,
  PrivateKey,
  PublicKey,
  createUserAuth,
  Users,
} from '@textile/hub';
import { updateCollections, initCollections } from './collections';

export const getAPISig = async (minutes: number = 30) => {
  const expiration = new Date(Date.now() + 1000 * 60 * minutes);
  return await createAPISig(process.env.USER_GROUP_API_SECRET, expiration);
};

let userDBClient;
export const newClientDB = async () => {
  if (userDBClient) {
    if (userDBClient.context.isExpired) {
      userDBClient = undefined;
      return newClientDB();
    }
    return Promise.resolve(userDBClient);
  }
  const API = process.env.API || undefined;
  const client = await Client.withUserAuth(
    await createUserAuth(process.env.USER_GROUP_API_KEY, process.env.USER_GROUP_API_SECRET),
    API,
    process.env.NODE_ENV !== 'production',
  );
  userDBClient = client;
  return client;
};
const identity = () => PrivateKey.fromString(process.env.AWF_DBkey);
let appDBClient;
export const getAppDB = async () => {
  if (appDBClient) {
    if (appDBClient.context.isExpired) {
      // tslint:disable-next-line:no-console
      console.info('==refreshing grpc session==');
      appDBClient = undefined;
      return getAppDB();
    }
    return Promise.resolve(appDBClient);
  }
  const API = process.env.API || undefined;
  const client = await Client.withUserAuth(
    await createUserAuth(process.env.APP_API_KEY, process.env.APP_API_SECRET),
    API,
    process.env.NODE_ENV !== 'production',
  );

  await client.getToken(identity());
  appDBClient = client;
  return client;
};

let mailSender;
export const getMailSender = async () => {
  if (mailSender) {
    if (mailSender.api.context.isExpired) {
      // tslint:disable-next-line:no-console
      console.info('==refreshing mail sender grpc session==');
      mailSender = undefined;
      return getMailSender();
    }
    return Promise.resolve(mailSender);
  }
  const api = Users.withUserAuth(
    await createUserAuth(process.env.USER_GROUP_API_KEY, process.env.USER_GROUP_API_SECRET),
    { debug: process.env.NODE_ENV !== 'production' },
  );
  const mailSenderID = identity();
  await api.getToken(mailSenderID);
  await api.setupMailbox();
  // const mailID = await api.getMailboxID();
  // if (!mailID) {
  //   await api.setupMailbox();
  // }
  mailSender = {
    sendMessage: async (to: string, message: Uint8Array) => {
      const toPubKey = PublicKey.fromString(to);
      return await api.sendMessage(mailSenderID, toPubKey, message);
    },
    api: api,
  };
  return mailSender;
};

export const setupDBCollections = async () => {
  const appDB = await getAppDB();
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

export const sendNotification = async (recipient: string, notificationObj: object) => {
  const ms = await getMailSender();
  const textEncoder = new TextEncoder();
  const encodedNotification = textEncoder.encode(JSON.stringify(notificationObj));
  await ms.sendMessage(recipient, encodedNotification);
};
