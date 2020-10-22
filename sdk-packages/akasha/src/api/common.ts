import registerCommonModule from '@akashaproject/sdk-common';
import { extractCallableServices } from '../utils';
import {
  CACHE_SERVICE,
  IPFS_SERVICE,
  VALIDATOR_SERVICE,
  WEB3_SERVICE,
  WEB3_UTILS_SERVICE,
} from '@akashaproject/sdk-common/lib/constants';

export const commonModule = registerCommonModule();

/**
 *
 * @param channel
 * returns {
 * commons: { cacheService: { getStash },
 * ipfsService: { getInstance, getUtils, upload },
 * validatorService: { getValidator },
 * web3Service: { regen, wallet, web3 },
 * web3UtilsService: { getUtils }
 * }}
 */
export default function commonApi(channel) {
  const extractedServices = extractCallableServices(commonModule, channel);
  return {
    [commonModule.name]: {
      cacheService: {
        getStash: extractedServices[CACHE_SERVICE]('getStash'),
      },
      ipfsService: {
        getInstance: extractedServices[IPFS_SERVICE]('getInstance'),
        getUtils: extractedServices[IPFS_SERVICE]('getUtils'),
        upload: extractedServices[IPFS_SERVICE]('upload'),
        getSettings: extractedServices[IPFS_SERVICE]('getSettings'),
      },
      validatorService: {
        getValidator: extractedServices[VALIDATOR_SERVICE]('getValidator'),
      },
      web3Service: {
        web3: extractedServices[WEB3_SERVICE]('web3'),
        wallet: extractedServices[WEB3_SERVICE]('wallet'),
        regen: extractedServices[WEB3_SERVICE]('regen'),
      },
      web3UtilsService: {
        getUtils: extractedServices[WEB3_UTILS_SERVICE]('getUtils'),
      },
    },
  };
}
