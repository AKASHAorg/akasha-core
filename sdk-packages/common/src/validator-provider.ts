import Validator from '@akashaproject/jsonschema-web3';
import { IAkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { VALIDATOR_SERVICE_FACTORY } from './constants';

const registerValidatorProvider = (di: DIContainer): IAkashaService => {
  const service = () => {
    const validator = new Validator();
    return () => validator;
  };
  return { name: VALIDATOR_SERVICE_FACTORY, service };
};

export default registerValidatorProvider;
