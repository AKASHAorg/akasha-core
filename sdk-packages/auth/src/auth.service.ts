import commonServices, {
  CACHE_SERVICE,
  WEB3_SERVICE,
  WEB3_UTILS_SERVICE,
} from '@akashaproject/sdk-common/lib/constants';
import { EthProviders } from '@akashaproject/ui-awf-typings';
import coreServices from '@akashaproject/sdk-core/lib/constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import {
  AUTH_CACHE,
  AUTH_ENDPOINT,
  AUTH_MESSAGE,
  AUTH_SERVICE,
  ethAddressCache,
  moduleName,
  tokenCache,
} from './constants';
import { Client, PrivateKey, Users, Buckets, UserAuth } from '@textile/hub';
import { Database } from '@textile/threaddb';
import { generatePrivateKey, loginWithChallenge } from './hub.auth';
import { settingsSchema } from './db.schema';

const service: AkashaService = (invoke, log) => {
  let identity: PrivateKey;
  let hubClient: Client;
  let hubUser: Users;
  let buckClient: Buckets;
  let auth: UserAuth;
  let db: Database;
  let channel;
  let currentUser: { pubKey: string; ethAddress: string };
  let tokenGenerator: () => Promise<UserAuth>;
  const providerKey = '@providerType';
  if ('BroadcastChannel' in self) {
    channel = new BroadcastChannel('sync_data');
  }
  const signIn = async (provider: EthProviders = EthProviders.Web3Injected) => {
    let currentProvider;
    const { setServiceSettings } = invoke(coreServices.SETTINGS_SERVICE);
    const cache = await invoke(commonServices[CACHE_SERVICE]).getStash();

    if (provider === EthProviders.None) {
      if (!sessionStorage.getItem(providerKey)) {
        throw new Error('The provider must have a wallet/key in order to authenticate.');
      }
      currentProvider = +sessionStorage.getItem(providerKey); // cast to int
    } else {
      currentProvider = provider;
      sessionStorage.setItem(providerKey, currentProvider);
    }

    const web3 = await invoke(commonServices[WEB3_SERVICE]).web3(currentProvider);
    const web3Utils = await invoke(commonServices[WEB3_UTILS_SERVICE]).getUtils();

    const { getSettings } = invoke(coreServices.SETTINGS_SERVICE);
    const authSettings = await getSettings(moduleName);
    const endPoint = authSettings[AUTH_ENDPOINT];
    const signer = web3.getSigner();
    const address = await signer.getAddress();
    const sessKey = `@identity:${address.toLowerCase()}:${currentProvider}`;
    if (sessionStorage.getItem(sessKey)) {
      identity = PrivateKey.fromString(sessionStorage.getItem(sessKey));
    } else {
      const sig = await signer.signMessage(AUTH_MESSAGE);
      identity = await generatePrivateKey(signer, address, sig, web3Utils);
      sessionStorage.setItem(sessKey, identity.toString());
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
    db = new Database(`awf-alpha-user-${pubKey.slice(-8)}`, {
      name: 'settings',
      schema: settingsSchema,
    });
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
      return Promise.resolve(null);
    }
    return signIn(EthProviders.None);
  };

  const signOut = async () => {
    const cache = await invoke(commonServices[CACHE_SERVICE]).getStash();
    await cache.clear();
    sessionStorage.clear();
    identity = null;
    hubClient = null;
    hubUser = null;
    buckClient = null;
    auth = null;
    db = null;
    currentUser = null;
    return;
  };
  return { signIn, signOut, getSession, getToken, getCurrentUser };
};

export default { service, name: AUTH_SERVICE };
