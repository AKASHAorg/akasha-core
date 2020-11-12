import commonServices, {
  CACHE_SERVICE,
  WEB3_SERVICE,
  WEB3_UTILS_SERVICE,
} from '@akashaproject/sdk-common/lib/constants';
import { EthProviders } from '@akashaproject/ui-awf-typings';
import coreServices from '@akashaproject/sdk-core/lib/constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { DB_NAME, DB_PASSWORD, moduleName as DB_MODULE } from '@akashaproject/sdk-db/lib/constants';
import {
  AUTH_CACHE,
  AUTH_ENDPOINT,
  AUTH_MESSAGE,
  AUTH_SERVICE,
  ethAddressCache,
  moduleName,
  tokenCache,
} from './constants';
import { Client, PrivateKey, Users, Buckets } from '@textile/hub';
import { generatePrivateKey, loginWithChallenge } from './hub.auth';

const service: AkashaService = (invoke, log) => {
  let identity: PrivateKey;
  let hubClient: Client;
  let hubUser: Users;
  let buckClient: Buckets;
  const providerKey = '@providerType';
  const signIn = async (provider: EthProviders = EthProviders.Web3Injected) => {
    let currentProvider;
    const { setServiceSettings } = invoke(coreServices.SETTINGS_SERVICE);
    const cache = await invoke(commonServices[CACHE_SERVICE]).getStash();

    if (provider === EthProviders.None) {
      if (!sessionStorage.getItem(providerKey)) {
        throw new Error('The provider must have a wallet/key in order to authenticate.');
      }
      currentProvider = sessionStorage.getItem(providerKey);
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
    await setServiceSettings(DB_MODULE, [
      [DB_PASSWORD, web3Utils.id(address)],
      [DB_NAME, `ewa01${address.toLowerCase()}`], // so it doesn't crash for multiple auth users using the same browser
    ]);
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
    const token = await hubClient.getToken(identity);
    cache.set(AUTH_CACHE, {
      [ethAddressCache]: address,
      [tokenCache]: token,
    });
    return { client: hubClient, user: hubUser, token: token, ethAddress: address };
  };

  const getSession = async () => {
    if (!sessionStorage.getItem(providerKey)) {
      throw new Error('No previous session found');
    }

    if (!identity) {
      await signIn(EthProviders.None);
    }

    return {
      identity,
      client: hubClient,
      user: hubUser,
      buck: buckClient,
    };
  };

  return { signIn, getSession };
};

export default { service, name: AUTH_SERVICE };
