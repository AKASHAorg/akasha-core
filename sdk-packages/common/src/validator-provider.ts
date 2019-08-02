import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { VALIDATOR_SERVICE_FACTORY } from './constants';
import Validator from '@akashaproject/jsonschema-web3';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';

const registerValidatorProvider = function(di: DIContainer): AkashaService {
  const service = function() {
    const validator = new Validator();
    return () => validator;
  };
  return { name: VALIDATOR_SERVICE_FACTORY, service };
};

export default registerValidatorProvider;
