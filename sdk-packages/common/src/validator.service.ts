import Validator from '@akashaproject/jsonschema-web3';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { registerServiceMethods, toNamedService } from '@akashaproject/sdk-core/lib/utils';
import { VALIDATOR_SERVICE } from './constants';

const service: AkashaService = () => {
  const validator = new Validator();
  return registerServiceMethods({ validator });
};

export default toNamedService(VALIDATOR_SERVICE, service);
