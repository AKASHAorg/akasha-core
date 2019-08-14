import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import {
  createServiceMethod,
  registerServiceMethods,
  toNamedService,
} from '@akashaproject/sdk-core/lib/utils';
import { utils } from 'ethers';
import { WEB3_UTILS_SERVICE } from './constants';

const service: AkashaService = () => {
  return registerServiceMethods({ utils: createServiceMethod(utils) });
};

export default toNamedService(WEB3_UTILS_SERVICE, service);
