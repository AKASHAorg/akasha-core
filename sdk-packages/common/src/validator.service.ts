import Validator from '@akashaproject/jsonschema-web3';
import Schema from 'ipld-schema';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { VALIDATOR_SERVICE } from './constants';

const service: AkashaService = (invoke, log) => {
  const validator = new Validator();
  const getValidator = async () => validator;
  const ipldSchema = async (model: string) => new Schema(model);
  return { getValidator, ipldSchema };
};

export default { service, name: VALIDATOR_SERVICE };
