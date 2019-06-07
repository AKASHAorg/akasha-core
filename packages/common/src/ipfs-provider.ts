import * as IPFS from 'ipfs';
import ipfsSettings from './ipfs.settings';
import { IPFS_SERVICE } from '@akashaproject/sdk-core/lib/constants';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';

export default function registerService (di: DIContainer) {
  const service = async function () {
    const node = new IPFS({config: ipfsSettings, start: false});
    node.on('ready', () => node.start());
    return node;
  };
  return { service, name: IPFS_SERVICE };
}
