import {
  Client,
  createAPISig,
  createUserAuth,
  PrivateKey,
  PublicKey,
  ThreadID,
} from '@textile/hub';
import { initCollections, updateCollections } from './collections';
import winston from 'winston';
import { normalize } from 'eth-ens-namehash';
import { ethers, providers, utils } from 'ethers';
import objHash from 'object-hash';
import mailgun from 'mailgun-js';
import fetch from 'node-fetch';
import path from 'path';
import { AbortController } from 'node-abort-controller';
import { Worker } from 'worker_threads';
import { create } from 'ipfs-http-client';
import sharp from 'sharp';
import { AuthorNotificationValue } from './collections/interfaces';

const MODERATION_APP_URL = process.env.MODERATION_APP_URL;
const MODERATION_EMAIL = process.env.MODERATION_EMAIL;
const MODERATION_EMAIL_SOURCE = process.env.MAILGUN_EMAIL_SOURCE;

const INFURA_IPFS_ID = process.env.INFURA_IPFS_ID;
const INFURA_IPFS_SECRET = process.env.INFURA_IPFS_SECRET;
const IPFS_GATEWAY = process.env.IPFS_GATEWAY;
export const isIpfsEnabled = INFURA_IPFS_ID && INFURA_IPFS_SECRET && IPFS_GATEWAY;

let ipfsClient;
if (isIpfsEnabled) {
  ipfsClient = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization:
        'Basic ' + Buffer.from(INFURA_IPFS_ID + ':' + INFURA_IPFS_SECRET).toString('base64'),
    },
  });
}

let mailGun;
if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
  mailGun = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    host: process.env.MAILGUN_HOST,
  });
}

export const EMPTY_KEY = 'baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

export const EMPTY_PROFILE = {
  _id: EMPTY_KEY,
  ethAddress: EMPTY_ADDRESS,
  pubKey: EMPTY_KEY,
};

export const getAPISig = async (minutes = 30) => {
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
  const client = Client.withUserAuth(
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
      logger.info('==refreshing grpc session==');
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

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple(),
      ),
    }),
  ],
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
  return normalizedArray.join('.');
};

const eip1271Abi = [
  'function isValidSignature( bytes32 _hash, bytes calldata _signature ) external view returns (bytes4)',
  //'function getMessageHash(bytes memory message) public view returns (bytes32)',
];
export const magicValue = '0x1626ba7e';

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
    // give some time for the state to update
    await new Promise(res => setTimeout(res, 10000));
    const valid = await contract.isValidSignature(hashMessage, signature);
    return Promise.resolve(valid === magicValue);
  } catch (err) {
    logger.warn('eip1271 sig validation error');
    logger.warn(err);
    const msgSigner = utils.verifyMessage(hexArray, signature);
    return Promise.resolve(utils.getAddress(msgSigner) === utils.getAddress(address));
  }
};
const encoder = new TextEncoder();
// @Todo: Use the sdk lib for this
export const verifyEd25519Sig = async (args: {
  pubKey: string;
  data: Uint8Array | string | Record<string, unknown>;
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
    serializedData = objHash(args.data);
  }
  serializedData = encoder.encode(serializedData);
  return pub.verify(serializedData, sig);
};

export const sendNotification = async (
  recipient: string,
  notificationObj: Record<string, unknown>,
) => {
  const worker = new Worker(path.resolve(__dirname, './notifications.js'), {
    workerData: {
      recipient,
      notificationObj,
    },
  });
  worker.on('message', msg => {
    if (!msg) {
      logger.info('Notification sent from worker');
    } else {
      logger.error(msg);
    }
  });
  worker.on('error', error => {
    logger.error(error);
  });
};

export const sendAuthorNotification = async (
  recipient: string,
  notification: {
    property: string;
    provider: string;
    value: AuthorNotificationValue;
  },
) => {
  if (recipient === notification?.value?.author) {
    return Promise.resolve(null);
  }
  return sendNotification(recipient, notification);
};

/**
 * Send an email notifications for moderation purposes.
 * @returns A promise that resolves upon sending the email
 */
export const sendEmailNotification = async () => {
  if (!mailGun) {
    return Promise.resolve();
  }
  logger.info('Sending email notification to moderators');
  const data = {
    from: `Moderation Notifications <${MODERATION_EMAIL_SOURCE}>`,
    to: MODERATION_EMAIL,
    subject: 'New moderation request',
    text: `There is a new pending request for moderation. To moderate this content please visit the moderation app at:\n
${MODERATION_APP_URL}
\nThank you!`,
  };
  mailGun.messages().send(data, function (error) {
    if (error) {
      logger.error(error);
    }
  });
  return Promise.resolve();
};

export const decodeString = (value: string) => {
  return value ? Buffer.from(value, 'base64').toString() : '';
};

export const encodeString = (value: string) => {
  return value ? Buffer.from(value).toString('base64') : '';
};

export async function fetchWithTimeout(resource, options) {
  const { timeout = 12000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);

  return response;
}

export async function addToIpfs(link: string) {
  if (!ipfsClient) {
    return Promise.resolve();
  }
  const response = await fetchWithTimeout(link, {
    timeout: 16000,
    redirect: 'follow',
  });
  const resizePipeline = sharp({ failOnError: false });
  // can specify for example to store the image in multiple formats
  const processSteps = [];
  // transform to a different format
  processSteps.push(
    resizePipeline
      .clone()
      .resize({ width: 640, height: 500, fit: sharp.fit.inside })
      .webp({ lossless: true })
      .toBuffer(),
  );
  // apply
  response.body.pipe(resizePipeline);
  try {
    // wait for all processes to finish
    const processed = await Promise.all(processSteps);
    // picking only the first job result
    return ipfsClient.add(processed[0]);
  } catch (e) {
    logger.warn(e?.message);
    return;
  }
}

export function createIpfsGatewayLink(cid: string) {
  return `https://${cid}.${IPFS_GATEWAY}`;
}

export async function getWalletOwners(
  scAddress: string,
  provider: ethers.providers.Provider | ethers.Signer,
): Promise<string[]> {
  try {
    const contract = new ethers.Contract(
      scAddress,
      ['function getOwners() public view returns (address[])'],
      provider,
    );
    return contract.getOwners();
  } catch (e) {
    logger.warn(`${scAddress} does not support getOwners() method`);
    return Promise.resolve([]);
  }
}
