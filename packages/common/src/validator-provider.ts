import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { VALIDATOR_SERVICE_FACTORY } from './constants';
import Validator from '@akashaproject/jsonschema-web3';

const registerValidatorProvider = function(di: DIContainer) {
  const service = function() {
    const validator = new Validator();
    return () => validator;
  };
  return { name: VALIDATOR_SERVICE_FACTORY, service };
};

export default registerValidatorProvider;
