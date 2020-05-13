import commonServices, {
  CACHE_SERVICE,
  WEB3_SERVICE,
  WEB3_UTILS_SERVICE,
} from '@akashaproject/sdk-common/lib/constants';
import { EthProviders } from '@akashaproject/ui-awf-typings';
import coreServices from '@akashaproject/sdk-core/lib/constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import dbServices, {
  DB_NAME,
  DB_PASSWORD,
  DB_SERVICE,
  DB_SETTINGS_ATTACHMENT,
  moduleName as DB_MODULE,
} from '@akashaproject/sdk-db/lib/constants';
import * as superagent from 'superagent';
import {
  AUTH_CACHE,
  AUTH_ENDPOINT,
  AUTH_MESSAGE,
  AUTH_SERVICE,
  ethAddressCache,
  moduleName,
  tokenCache,
} from './constants';

const service: AkashaService = (invoke, log) => {
  const getJWT = async (args: { eth_address: string; signature: string }) => {
    const { getSettings } = invoke(coreServices.SETTINGS_SERVICE);
    const authSettings = await getSettings(moduleName);
    const endPoint = authSettings[AUTH_ENDPOINT];
    log.info(`getting a new JWT from ${endPoint}`);
    const res = await superagent.post(endPoint).send(args).set('accept', 'json');
    return res.text;
  };

  const signIn = async (provider: EthProviders = EthProviders.Web3Injected) => {
    const { setServiceSettings } = invoke(coreServices.SETTINGS_SERVICE);
    const cache = await invoke(commonServices[CACHE_SERVICE]).getStash();
    const web3 = await invoke(commonServices[WEB3_SERVICE]).web3(provider);
    const web3Utils = await invoke(commonServices[WEB3_UTILS_SERVICE]).getUtils();
    if (provider === EthProviders.None) {
      throw new Error('The provider must have a wallet/key in order to authenticate.');
    }
    const signer = web3.getSigner();
    const address = await signer.getAddress();
    await setServiceSettings(DB_MODULE, [
      [DB_PASSWORD, web3Utils.id(address)],
      [DB_NAME, `ewa01${address.toLowerCase()}`], // so it doesn't crash for multiple auth users using the same browser
    ]);
    const attachment = await invoke(dbServices[DB_SETTINGS_ATTACHMENT]);
    const authAttachmentToken = await attachment.get({ id: 'auth_token', ethAddress: address });
    if (authAttachmentToken) {
      cache.set(AUTH_CACHE, { [ethAddressCache]: address, [tokenCache]: authAttachmentToken });
      return authAttachmentToken;
    }
    const sig = await signer.signMessage(AUTH_MESSAGE);
    const token = await getJWT({ eth_address: address, signature: sig });

    await invoke(dbServices[DB_SERVICE]).getDB();
    await attachment.put({
      obj: { id: 'auth_token', type: 'string', data: token },
      ethAddress: address,
    });
    cache.set(AUTH_CACHE, { [ethAddressCache]: address, [tokenCache]: token });
    return token;
  };

  return { getJWT, signIn };
};

export default { service, name: AUTH_SERVICE };
