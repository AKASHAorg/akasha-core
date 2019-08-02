import { IAkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { utils } from 'ethers';
import { WEB3_UTILS } from './constants';

export default function registerService(di: DIContainer): IAkashaService {
  const runService = async () => {
    // add more utilities on top of existing ethers lib
    return () => utils;
  };

  return { name: WEB3_UTILS, service: runService };
}
