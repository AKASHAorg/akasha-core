import { AkashaServiceFactory, IAkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { IPFS_SERVICE } from './constants';
import ipfsSettings from './ipfs.settings';

// tslint:disable-next-line:no-var-requires
const IPFS = require('ipfs');

const registerService: AkashaServiceFactory = (di: DIContainer): IAkashaService => {
  const service = async () => {
    const s = new IPFS({ config: ipfsSettings, start: false });
    return () => s;
  };
  return { service, name: IPFS_SERVICE };
};

export default registerService;
