import coreServices from '@akashaproject/sdk-core/lib/constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import commonServices, { WEB3_SERVICE } from '@akashaproject/sdk-common/lib/constants';
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
    const web3 = await invoke(commonServices[WEB3_SERVICE]).web3();
    const signer = web3.getSigner();
    const address = await signer.getAddress();
    const sig = await signer.signMessage(AUTH_MESSAGE);
    return getJWT({ eth_address: address, signature: sig });
  };

  return { getJWT, signIn };
};

export default { service, name: AUTH_SERVICE };
