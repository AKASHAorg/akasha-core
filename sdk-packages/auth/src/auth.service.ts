import commonServices, {
  CACHE_SERVICE,
  WEB3_SERVICE,
  WEB3_UTILS_SERVICE,
} from '@akashaproject/sdk-common/lib/constants';
import { EthProviders } from '@akashaproject/ui-awf-typings';
import coreServices from '@akashaproject/sdk-core/lib/constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import services, {
  AUTH_CACHE,
  AUTH_ENDPOINT,
  AUTH_MESSAGE,
  AUTH_SERVICE,
  authStatus,
  ethAddressCache,
  moduleName,
} from './constants';
import {
  Buckets,
  Client,
  InboxListOptions,
  PrivateKey,
  PublicKey,
  Status,
  UserAuth,
  Users,
} from '@textile/hub';
import { Database } from '@textile/threaddb';
import { generatePrivateKey, loginWithChallenge } from './hub.auth';
import { settingsSchema } from './db.schema';
import { runGQL } from '@akashaproject/sdk-runtime/lib/gql.network.client';

const service: AkashaService = (invoke, log, globalChannel) => {
  let identity: PrivateKey;
  let hubClient: Client;
  let hubUser: Users;
  let buckClient: Buckets;
  let auth: UserAuth;
  let db: Database;
  let channel;
  let sessKey;
  let inboxWatcher;
  let currentUser: { pubKey: string; ethAddress: string; isNewUser?: boolean };
  let tokenGenerator: () => Promise<UserAuth>;
  const waitForAuth = 'waitForAuth';
  const providerKey = '@providerType';
  const currentUserKey = '@currentUserType';
  const SYNC_REQUEST = '@sync_request';
  const SYNC_RESPONSE = '@sync_response';
  const SYNC_CHANNEL = '@sync_data';
  const SIGN_OUT_EVENT = '@sign_out';
  // const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  if ('BroadcastChannel' in self) {
    channel = new BroadcastChannel(SYNC_CHANNEL);
    channel.postMessage({ type: SYNC_REQUEST });
    channel.onmessage = function (event) {
      const { type } = event.data;
      if (type === SYNC_REQUEST) {
        if (currentUser) {
          const response = {
            [providerKey]: sessionStorage.getItem(providerKey),
            [currentUserKey]: sessionStorage.getItem(currentUserKey),
            identity: { key: sessKey, value: identity?.toString() },
          };
          channel.postMessage({ response, type: SYNC_RESPONSE });
        }
      } else if (type === SYNC_RESPONSE) {
        const { response } = event.data;
        if (response && response.identity.key !== sessKey) {
          log.info('syncing session');
          sessionStorage.setItem(providerKey, response[providerKey]);
          sessionStorage.setItem(response?.identity?.key, response?.identity?.value);
          sessionStorage.setItem(currentUserKey, response[currentUserKey]);
          currentUser = null;
          getCurrentUser().then(data => log.info('logged in', data));
        }
      } else if (type === SIGN_OUT_EVENT && currentUser) {
        signOut().then(_ => {
          const response = {
            data: null,
            channelInfo: {
              servicePath: services[AUTH_SERVICE],
              method: 'signOut',
              args: null,
            },
          };
          globalChannel.next(response);
          log.info('signed-out');
        });
      }
    };
  }

  const checkIfSignedUp = async (ethAddress: string) => {
    const query = `
    query GetProfile($ethAddress: String!) {
       getProfile(ethAddress: $ethAddress) {
         ethAddress
         pubKey
       }
      }`;
    const variables = { ethAddress: ethAddress };
    const result = await runGQL({
      query: query,
      variables: variables,
      operationName: 'GetProfile',
    });
    if (result.errors) {
      const err = new Error('This ethereum key is not registered');
      err.name = 'UserNotRegistered';
      throw err;
    }
  };
  const signIn = async (
    args: { provider?: EthProviders; checkRegistered: boolean } = {
      provider: EthProviders.Web3Injected,
      checkRegistered: true,
    },
  ) => {
    let currentProvider: number;
    // const { setServiceSettings } = invoke(coreServices.SETTINGS_SERVICE);
    const cache = await invoke(commonServices[CACHE_SERVICE]).getStash();

    if (args.provider === EthProviders.None) {
      if (!sessionStorage.getItem(providerKey)) {
        throw new Error('The provider must have a wallet/key in order to authenticate.');
      }
      currentProvider = +sessionStorage.getItem(providerKey); // cast to int
    } else {
      currentProvider = args.provider;
      if (currentProvider === EthProviders.WalletConnect) {
        // @Todo: track https://github.com/WalletConnect/walletconnect-monorepo/issues/444
        // until there is a consistent way of detecting previous sessions and initiate disconnect
        localStorage.clear();
      }
    }
    try {
      const web3 = await invoke(commonServices[WEB3_SERVICE]).regen(currentProvider);
      const web3Utils = await invoke(commonServices[WEB3_UTILS_SERVICE]).getUtils();

      const { getSettings } = invoke(coreServices.SETTINGS_SERVICE);
      const authSettings = await getSettings(moduleName);
      const endPoint = authSettings[AUTH_ENDPOINT];
      const signer = web3.getSigner();
      const address = await signer.getAddress();
      if (args.checkRegistered) {
        await checkIfSignedUp(address);
      }
      const web3Service = await invoke(commonServices[WEB3_SERVICE]);
      log.info(`using eth address ${address}`);
      sessKey = `@identity:${address.toLowerCase()}:${currentProvider}`;
      if (sessionStorage.getItem(sessKey)) {
        identity = PrivateKey.fromString(sessionStorage.getItem(sessKey));
      } else {
        const sig = await web3Service.signMessage(AUTH_MESSAGE);
        await new Promise(res => setTimeout(res, 600));
        identity = await generatePrivateKey(web3Service, address, sig, web3Utils);
      }

      const userAuth = loginWithChallenge(identity, web3Service, web3Utils);
      hubClient = Client.withUserAuth(userAuth, endPoint);
      hubUser = Users.withUserAuth(userAuth, endPoint);
      buckClient = Buckets.withUserAuth(userAuth, endPoint);
      tokenGenerator = loginWithChallenge(identity, web3Service, web3Utils);
      cache.set(AUTH_CACHE, {
        [ethAddressCache]: address,
      });
      // const mailID = await hubUser.getMailboxID();
      const pubKey = identity.public.toString();
      currentUser = { pubKey, ethAddress: address };
    } catch (e) {
      sessionStorage.clear();
      log.error(e);
      throw e;
    }
    auth = await tokenGenerator();
    await hubUser.getToken(identity);

    // @Todo: on error try to setupMail
    await hubUser.setupMailbox();
    const mailboxID = await hubUser.getMailboxID();
    inboxWatcher = await hubUser.watchInbox(mailboxID, ev => {
      if (ev?.message?.body && ev?.message?.readAt === 0) {
        globalChannel.next({
          data: true,
          channelInfo: {
            servicePath: services[AUTH_SERVICE],
            method: 'hasNewNotifications',
            args: null,
          },
        });
      }
    });
    sessionStorage.setItem(providerKey, currentProvider.toString());
    sessionStorage.setItem(sessKey, identity.toString());
    sessionStorage.setItem(currentUserKey, JSON.stringify(currentUser));
    if (channel) {
      const response = {
        [providerKey]: sessionStorage.getItem(providerKey),
        identity: { key: sessKey, value: sessionStorage.getItem(sessKey) },
        [currentUserKey]: sessionStorage.getItem(currentUserKey),
      };
      channel.postMessage({ response, type: SYNC_RESPONSE });
    }

    if (currentUser?.pubKey) {
      db = new Database(
        `awf-alpha-user-${currentUser.pubKey.slice(-8)}`,
        {
          name: 'settings',
          schema: settingsSchema,
        },
        { name: 'apps' },
      );
      // // not working atm
      // const remote = await db.remote.setUserAuth(userAuth);
      // remote.config.metadata.set('x-textile-thread-name', db.dexie.name);
      // remote.config.metadata.set('x-textile-thread', db.id);
      // await remote.authorize(identity);
      await db.open(1);
    }
    globalChannel.next({
      data: currentUser,
      channelInfo: {
        servicePath: services[AUTH_SERVICE],
        method: 'ready',
        args: null,
      },
    });
    return Object.assign(currentUser, authStatus);
  };

  const getSession = async () => {
    if (!sessionStorage.getItem(providerKey)) {
      throw new Error('No previous session found');
    }

    if (!identity) {
      await signIn({ provider: EthProviders.None, checkRegistered: false });
    }

    return {
      tokenGenerator,
      client: hubClient,
      user: hubUser,
      buck: buckClient,
      db: db,
      identity: identity,
    };
  };

  const getToken = async () => {
    const session = await getSession();
    // the definitions for Context are not updated
    // @ts-ignore
    const isExpired = session.client.context.isExpired;
    if (!isExpired && auth) {
      return auth.token;
    }
    auth = await tokenGenerator();
    return auth.token;
  };

  const getCurrentUser = async () => {
    if (currentUser) {
      return Promise.resolve(currentUser);
    }
    if (!sessionStorage.getItem(providerKey)) {
      return Promise.resolve(null);
    }

    const localUser = sessionStorage.getItem(currentUserKey);
    if (localUser) {
      globalChannel.next({
        data: true,
        channelInfo: {
          servicePath: services[AUTH_SERVICE],
          method: waitForAuth,
          args: null,
        },
      });
      try {
        globalChannel.next({
          data: JSON.parse(localUser),
          channelInfo: {
            servicePath: services[AUTH_SERVICE],
            method: 'signIn',
            args: null,
          },
        });
      } catch (e) {
        log.error(e);
      }
    }
    const data = await signIn({ provider: EthProviders.None, checkRegistered: false });
    const response = {
      data: data,
      channelInfo: {
        servicePath: services[AUTH_SERVICE],
        method: 'signIn',
        args: null,
      },
    };
    globalChannel.next(response);
    return data;
  };

  const signOut = async () => {
    sessionStorage.clear();
    identity = null;
    hubClient = null;
    hubUser = null;
    inboxWatcher = null;
    buckClient = null;
    auth = null;
    db = null;
    currentUser = null;
    if (channel) {
      channel.postMessage({ type: SIGN_OUT_EVENT });
    }
    const cache = await invoke(commonServices[CACHE_SERVICE]).getStash();
    await invoke(commonServices[WEB3_SERVICE]).destroy({});
    cache.clear();
    return true;
  };

  const signData = async (data: object | string, base64Format: boolean = false) => {
    const session = await getSession();
    let serializedData;
    if (typeof data === 'object') {
      serializedData = JSON.stringify(data);
    }
    serializedData = new TextEncoder().encode(serializedData);
    let sig: Uint8Array | string = await session.identity.sign(serializedData);
    if (base64Format) {
      sig = Buffer.from(sig).toString('base64');
    }
    return { serializedData, signature: sig, pubKey: identity.public.toString() };
  };

  const verifySignature = async (args: {
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
  const decryptMessage = async message => {
    const decryptedBody = await identity.decrypt(message.body);
    let body = new TextDecoder().decode(decryptedBody);
    try {
      body = JSON.parse(body);
    } catch (e) {
      log.warn(e);
    }
    const { from, readAt, createdAt, id } = message;
    return { body, from, readAt, createdAt, id };
  };
  const getMessages = async (args: InboxListOptions) => {
    const limit = args?.limit || 50;
    const messages = await hubUser.listInboxMessages(
      Object.assign({}, { status: Status.UNREAD, limit: limit }, args),
    );
    const readMessagesLimit = limit - messages.length;
    const readMessages =
      readMessagesLimit > 0
        ? await hubUser.listInboxMessages(
            Object.assign({}, { status: Status.ALL, limit: limit }, args),
          )
        : [];
    const combinedMessages = messages
      .concat(readMessages)
      .sort((a, b) => b.createdAt - a.createdAt);
    const inbox = [];
    const uniqueMessages = new Map();
    for (const messageObj of combinedMessages) {
      uniqueMessages.set(messageObj.id, messageObj);
    }
    for (const message of uniqueMessages.values()) {
      const decryptedObj = await decryptMessage(message);
      inbox.push(Object.assign({}, decryptedObj, { read: decryptedObj.readAt > 0 }));
    }
    uniqueMessages.clear();
    return inbox.slice();
  };

  const hasNewNotifications = async () => {
    const limit = 1;
    const messages = await hubUser.listInboxMessages({ status: Status.UNREAD, limit: limit });
    return messages.length > 0;
  };
  const markMessageAsRead = async (messageId: string) => {
    await hubUser.readInboxMessage(messageId);
    return true;
  };

  const deleteMessage = async (messageId: string) => {
    await hubUser.deleteInboxMessage(messageId);
    return true;
  };

  const validateInvite = async (inviteCode: string) => {
    const response = await fetch(`${process.env.INVITATION_ENDPOINT}/${inviteCode}`, {
      method: 'POST',
    });
    if (response.ok) {
      localStorage.setItem('@signUpToken', inviteCode);
      return true;
    }
    if (response.status === 403) {
      throw new Error('Sorry, this code has already been used. Please try another one.');
    }

    throw new Error('Sorry, this code is not valid. Please try again.');
  };
  return {
    signIn,
    signData,
    verifySignature,
    signOut,
    getSession,
    getToken,
    getCurrentUser,
    getMessages,
    markMessageAsRead,
    hasNewNotifications,
    deleteMessage,
    validateInvite,
  };
};

export default { service, name: AUTH_SERVICE };
