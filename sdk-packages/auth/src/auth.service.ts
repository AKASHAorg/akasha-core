import coreServices from '@akashaproject/sdk-core/lib/constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import commonServices, {
  WEB3_SERVICE,
  WEB3_UTILS_SERVICE,
} from '@akashaproject/sdk-common/lib/constants';
import dbServices, {
  DB_PASSWORD,
  DB_SERVICE,
  DB_SETTINGS_ATTACHMENT,
  moduleName as DB_MODULE,
} from '../../db/lib/constants';
import { AUTH_ENDPOINT, AUTH_MESSAGE, AUTH_SERVICE, moduleName } from './constants';
import * as superagent from 'superagent';

const service: AkashaService = (invoke, log) => {
  const getJWT = async (args: { eth_address: string; signature: string }) => {
    const { getSettings } = invoke(coreServices.SETTINGS_SERVICE);
    const authSettings = await getSettings(moduleName);
    const endPoint = authSettings[AUTH_ENDPOINT];
    log.info(`getting a new JWT from ${endPoint}`);
    const res = await superagent
      .post(endPoint)
      .send(args)
      .set('accept', 'json');
    return res.text;
  };

  const signIn = async () => {
    const { setServiceSettings } = invoke(coreServices.SETTINGS_SERVICE);
    const web3 = await invoke(commonServices[WEB3_SERVICE]).web3();
    const web3Utils = await invoke(commonServices[WEB3_UTILS_SERVICE]).getUtils();
    const signer = web3.getSigner();
    const address = await signer.getAddress();
    await setServiceSettings(DB_MODULE, [[DB_PASSWORD, web3Utils.id(address)]]);
    const attachment = await invoke(dbServices[DB_SETTINGS_ATTACHMENT]);
    const authAttachmentToken = await attachment.get({ id: 'auth_token', ethAddress: address });
    if (authAttachmentToken) {
      return authAttachmentToken;
    }
    const sig = await signer.signMessage(AUTH_MESSAGE);
    const token = await getJWT({ eth_address: address, signature: sig });

    await invoke(dbServices[DB_SERVICE]).getDB();
    await attachment.put({
      obj: { id: 'auth_token', type: 'string', data: token },
      ethAddress: address,
    });
    return token;
  };

  return { getJWT, signIn };
};

export default { service, name: AUTH_SERVICE };
