import { PrivateKey, PublicKey, createUserAuth, Users } from '@textile/hub';
import { logger } from './helpers';
import { parentPort, workerData } from 'worker_threads';

let mailSender;
const mailSenderIdentity = () => PrivateKey.fromString(process.env.AWF_MAILSENDER_KEY);

const getMailSender = async () => {
  if (mailSender) {
    if (mailSender.api.context.isExpired) {
      // tslint:disable-next-line:no-console
      logger.info('==refreshing mail sender grpc session==');
      mailSender = undefined;
      return getMailSender();
    }
    return Promise.resolve(mailSender);
  }
  const api = Users.withUserAuth(
    await createUserAuth(process.env.USER_GROUP_API_KEY, process.env.USER_GROUP_API_SECRET),
    { debug: process.env.NODE_ENV !== 'production' },
  );
  const mailSenderID = mailSenderIdentity();
  await api.getToken(mailSenderID);
  await api.setupMailbox();

  mailSender = {
    sendMessage: async (to: string, message: Uint8Array) => {
      const toPubKey = PublicKey.fromString(to);
      return await api.sendMessage(mailSenderID, toPubKey, message);
    },
    api: api,
  };
  return mailSender;
};

const sendMessage = async (recipient: string, notificationObj: Record<string, unknown>) => {
  const ms = await getMailSender();
  const textEncoder = new TextEncoder();
  const encodedNotification = textEncoder.encode(JSON.stringify(notificationObj));
  return ms.sendMessage(recipient, encodedNotification);
};

sendMessage(workerData.recipient, workerData.notificationObj)
  .then(() => {
    parentPort.postMessage(undefined);
  })
  .catch(error => {
    parentPort.postMessage(error);
  });
