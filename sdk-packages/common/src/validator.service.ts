import Validator from '@akashaproject/jsonschema-web3';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { VALIDATOR_SERVICE } from './constants';

const service: AkashaService = (invoke, log) => {
  const validator = new Validator();
  const getValidator = async () => validator;
  return { getValidator };
};

export default { name: VALIDATOR_SERVICE, service };
