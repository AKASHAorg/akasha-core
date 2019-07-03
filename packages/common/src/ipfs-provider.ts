import ipfsSettings from './ipfs.settings';
import { IPFS_SERVICE } from '@akashaproject/sdk-core/lib/constants';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
const IPFS = require('ipfs');

export default function registerService (di: DIContainer) {
  const service = async function () {
    return new IPFS({config: ipfsSettings, start: false});
  };
  return { service, name: IPFS_SERVICE };
}
