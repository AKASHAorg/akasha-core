import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { WEB3_UTILS } from './constants';
import { utils } from 'ethers';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';

export default function registerService (di: DIContainer): AkashaService {
  const runService = async function() {
    // add more utilities on top of existing ethers lib
    return () => utils;
  };

  return { name: WEB3_UTILS, service: runService };
}
