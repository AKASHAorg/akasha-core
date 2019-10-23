import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { utils } from 'ethers';
import { WEB3_UTILS_SERVICE } from './constants';

const service: AkashaService = (invoke, log) => {
  const getUtils = async () => utils;
  return { getUtils };
};

export default { name: WEB3_UTILS_SERVICE, service };
