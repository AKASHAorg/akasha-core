import Validator from '@akashaproject/jsonschema-web3';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { registerServiceMethods, toNamedService } from '@akashaproject/sdk-core/lib/utils';
import { VALIDATOR_SERVICE } from './constants';

const service: AkashaService = (invoke, log) => {
  const validator = new Validator();
  const getValidator = async () => validator;
  return registerServiceMethods({ getValidator });
};

export default toNamedService(VALIDATOR_SERVICE, service);
