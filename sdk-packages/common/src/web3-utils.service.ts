import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import ethers, { utils } from 'ethers';
import { WEB3_UTILS_SERVICE } from './constants';

const service: AkashaService = (invoke, log) => {
  const mergedUtils = Object.assign({}, utils, { BigNumber: ethers.BigNumber });
  const getUtils = async () => mergedUtils;
  return { getUtils };
};

export default { service, name: WEB3_UTILS_SERVICE };
