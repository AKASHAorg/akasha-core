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
  ethAddressCache,
  moduleName,
} from './constants';
import {
  Client,
  PrivateKey,
  Users,
  Buckets,
  UserAuth,
  PublicKey,
  InboxListOptions,
  Status,
} from '@textile/hub';
import { Database } from '@textile/threaddb';
import { generatePrivateKey, loginWithChallenge } from './hub.auth';
import { settingsSchema } from './db.schema';

const service: AkashaService = (invoke, log, globalChannel) => {
  let identity: PrivateKey;
  let hubClient: Client;
  let hubUser: Users;
  let buckClient: Buckets;
  let auth: UserAuth;
  let db: Database;
  let channel;
  let sessKey;
  let currentUser: { pubKey: string; ethAddress: string };
  let tokenGenerator: () => Promise<UserAuth>;
  const waitForAuth = 'waitForAuth';
  const providerKey = '@providerType';
  const SYNC_REQUEST = '@sync_request';
  const SYNC_RESPONSE = '@sync_response';
  const SYNC_CHANNEL = '@sync_data';
  const SIGN_OUT_EVENT = '@sign_out';
  if ('BroadcastChannel' in self) {
    channel = new BroadcastChannel(SYNC_CHANNEL);
    channel.postMessage({ type: SYNC_REQUEST });
    channel.onmessage = function (event) {
      const { type } = event.data;
      if (type === SYNC_REQUEST) {
        const response = {
          [providerKey]: sessionStorage.getItem(providerKey),
          identity: { key: sessKey, value: identity?.toString() },
        };
        channel.postMessage({ response, type: SYNC_RESPONSE });
      } else if (type === SYNC_RESPONSE) {
        const { response } = event.data;
        if (response && response.identity.key !== sessKey) {
          log.info('syncing session');
          sessionStorage.setItem(providerKey, response[providerKey]);
          sessionStorage.setItem(response?.identity?.key, response?.identity?.value);
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
  const signIn = async (provider: EthProviders = EthProviders.Web3Injected) => {
    let currentProvider;
    // const { setServiceSettings } = invoke(coreServices.SETTINGS_SERVICE);
    const cache = await invoke(commonServices[CACHE_SERVICE]).getStash();

    if (provider === EthProviders.None) {
      if (!sessionStorage.getItem(providerKey)) {
        throw new Error('The provider must have a wallet/key in order to authenticate.');
      }
      currentProvider = +sessionStorage.getItem(providerKey); // cast to int
      sessionStorage.removeItem(providerKey);
    } else {
      currentProvider = provider;
    }

    const web3 = await invoke(commonServices[WEB3_SERVICE]).web3(currentProvider);
    const web3Utils = await invoke(commonServices[WEB3_UTILS_SERVICE]).getUtils();

    const { getSettings } = invoke(coreServices.SETTINGS_SERVICE);
    const authSettings = await getSettings(moduleName);
    const endPoint = authSettings[AUTH_ENDPOINT];
    const signer = web3.getSigner();
    const address = await signer.getAddress();
    sessKey = `@identity:${address.toLowerCase()}:${currentProvider}`;
    if (sessionStorage.getItem(sessKey)) {
      identity = PrivateKey.fromString(sessionStorage.getItem(sessKey));
      sessionStorage.removeItem(sessKey);
    } else {
      const sig = await signer.signMessage(AUTH_MESSAGE);
      await new Promise(res => setTimeout(res, 600));
      identity = await generatePrivateKey(signer, address, sig, web3Utils);
    }

    const userAuth = loginWithChallenge(identity, signer);
    hubClient = Client.withUserAuth(userAuth, endPoint);
    hubUser = Users.withUserAuth(userAuth, endPoint);
    buckClient = Buckets.withUserAuth(userAuth, endPoint);
    tokenGenerator = loginWithChallenge(identity, signer);
    auth = await tokenGenerator();
    await hubUser.getToken(identity);

    // @Todo: on error try to setupMail
    await hubUser.setupMailbox();
    // const mailID = await hubUser.getMailboxID();
    const pubKey = identity.public.toString();
    // // for 1st time users
    // if (!mailID) {
    //   await hubUser.setupMailbox();
    // }
    db = new Database(
      `awf-alpha-user-${pubKey.slice(-8)}`,
      {
        name: 'settings',
        schema: settingsSchema,
      },
      { name: 'apps' },
    );
    await db.open(1);
    // // not working atm
    // const remote = await db.remote.setUserAuth(userAuth);
    // remote.config.metadata.set('x-textile-thread-name', db.dexie.name);
    // remote.config.metadata.set('x-textile-thread', db.id);
    // await remote.authorize(identity);

    cache.set(AUTH_CACHE, {
      [ethAddressCache]: address,
    });
    currentUser = { pubKey, ethAddress: address };
    if (channel) {
      const response = {
        [providerKey]: sessionStorage.getItem(providerKey),
        identity: { key: sessKey, value: identity?.toString() },
      };
      channel.postMessage({ response, type: SYNC_RESPONSE });
    }
    sessionStorage.setItem(providerKey, currentProvider);
    sessionStorage.setItem(sessKey, identity.toString());
    return currentUser;
  };

  const getSession = async () => {
    if (!sessionStorage.getItem(providerKey)) {
      throw new Error('No previous session found');
    }

    if (!identity) {
      await signIn(EthProviders.None);
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
      globalChannel.next({
        data: false,
        channelInfo: {
          servicePath: services[AUTH_SERVICE],
          method: waitForAuth,
          args: null,
        },
      });
      return Promise.resolve(null);
    }
    globalChannel.next({
      data: true,
      channelInfo: {
        servicePath: services[AUTH_SERVICE],
        method: waitForAuth,
        args: null,
      },
    });
    const data = await signIn(EthProviders.None);
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
    const cache = await invoke(commonServices[CACHE_SERVICE]).getStash();
    cache.clear();
    identity = null;
    hubClient = null;
    hubUser = null;
    buckClient = null;
    auth = null;
    db = null;
    currentUser = null;
    if (channel) {
      channel.postMessage({ type: SIGN_OUT_EVENT });
    }
    return;
  };

  const signData = async (data: object | string) => {
    const session = await getSession();
    let serializedData;
    if (typeof data === 'object') {
      serializedData = JSON.stringify(data);
    }
    serializedData = new TextEncoder().encode(serializedData);
    const sig = await session.identity.sign(serializedData);
    return { serializedData, signature: sig, pubKey: identity.public.toString() };
  };

  const verifySignature = async (args: {
    pubKey: string;
    data: Uint8Array | string | object;
    signature: Uint8Array;
  }) => {
    const pub = PublicKey.fromString(args.pubKey);
    let serializedData;
    if (args.data instanceof Uint8Array) {
      return pub.verify(args.data, args.signature);
    }
    if (typeof args.data === 'object') {
      serializedData = JSON.stringify(args.data);
    }
    serializedData = new TextEncoder().encode(serializedData);
    return pub.verify(serializedData, args.signature);
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
    const messages = await hubUser.listInboxMessages(
      Object.assign({}, { status: Status.UNREAD }, args),
    );
    const inbox = [];
    for (const message of messages) {
      inbox.push(await decryptMessage(message));
    }
    return inbox.slice();
  };
  const markMessageAsRead = async (messageId: string) => {
    await hubUser.readInboxMessage(messageId);
    await hubUser.deleteInboxMessage(messageId);
    return true;
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
  };
};

export default { service, name: AUTH_SERVICE };
