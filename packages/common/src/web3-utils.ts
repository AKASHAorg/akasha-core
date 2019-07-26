import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { WEB3_UTILS } from './constants';
import { utils } from 'ethers';

export default function registerService (di: DIContainer) {
  const runService = async function() {
    // add more utilities on top of existing ethers lib
    return () => utils;
  };

  return { name: WEB3_UTILS, service: runService };
}
