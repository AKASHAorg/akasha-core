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
import winston from 'winston';
import { normalize } from 'eth-ens-namehash';
import { ethers, utils, providers } from 'ethers';
import promClient from 'prom-client';

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
  if (!process.env.AWF_THREADdb) {
    await appDB.newDB(threadID, process.env.AWF_DBname || 'defaultDB');
  }

  await initCollections(appDB, threadID);
  await updateCollections(appDB, threadID);
  return { threadID, client: appDB };
};

export const sendNotification = async (recipient: string, notificationObj: object) => {
  const ms = await getMailSender();
  const textEncoder = new TextEncoder();
  const encodedNotification = textEncoder.encode(JSON.stringify(notificationObj));
  logger.info('sending notification to', recipient);
  try {
    await ms.sendMessage(recipient, encodedNotification);
  } catch (e) {
    logger.error('notification error', e);
  }
};

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [new winston.transports.Console({ format: winston.format.simple() })],
});

const isEncodedLabelhash = hash => {
  return hash.startsWith('[') && hash.endsWith(']') && hash.length === 66;
};
// from @ensdomains/ensjs
export const validateName = (name: string) => {
  const nameArray = name.split('.');
  const hasEmptyLabels = nameArray.filter(e => e.length < 1).length > 0;
  if (hasEmptyLabels) throw new Error('Domain cannot have empty labels');
  const normalizedArray = nameArray.map(label => {
    return isEncodedLabelhash(label) ? label : normalize(label);
  });
  try {
    return normalizedArray.join('.');
  } catch (e) {
    throw e;
  }
};

const eip1271Abi = [
  'function isValidSignature(bytes32 _message, bytes _signature) public view returns (bool)',
];

export const isValidSignature = async (
  message: string,
  signature: string,
  address: string,
  provider: providers.Provider,
): Promise<boolean> => {
  const normalisedMsg = utils.hexlify(utils.toUtf8Bytes(message));
  const hexArray = utils.arrayify(normalisedMsg);
  const hashMessage = utils.hashMessage(hexArray);
  try {
    const contract = new ethers.Contract(address, eip1271Abi, provider);
    const valid = await contract.isValidSignature(hashMessage, signature);
    return Promise.resolve(valid);
  } catch (err) {
    const msgSigner = utils.verifyMessage(hexArray, signature);
    return Promise.resolve(utils.getAddress(msgSigner) === utils.getAddress(address));
  }
};
const encoder = new TextEncoder();
// @Todo: Use the sdk lib for this
export const verifyEd25519Sig = async (args: {
  pubKey: string;
  data: Uint8Array | string | object;
  signature: Uint8Array | string;
}) => {
  const pub = PublicKey.fromString(args.pubKey);
  let sig: Uint8Array;
  if (args.signature instanceof Uint8Array) {
    sig = args.signature;
  } else {
    const str = Buffer.from(args.signature, 'base64');
    sig = Uint8Array.from(str);
  }
  let serializedData;
  if (args.data instanceof Uint8Array) {
    return pub.verify(args.data, sig);
  }
  if (typeof args.data === 'object') {
    serializedData = JSON.stringify(args.data);
  }
  serializedData = encoder.encode(serializedData);
  return pub.verify(serializedData, sig);
};

export const sendAuthorNotification = async (
  recipient: string,
  notification: { property: string; provider: string; value: any },
) => {
  if (recipient === notification?.value?.author) {
    return;
  }
  return sendNotification(recipient, notification);
};

export const captureCallDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of api requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.7, 1, 3, 5, 7, 10, 15],
});
