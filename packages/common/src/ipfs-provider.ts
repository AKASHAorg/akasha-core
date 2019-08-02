import ipfsSettings from './ipfs.settings';
import { IPFS_SERVICE } from './constants';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { AkashaService, AkashaServiceFactory } from '@akashaproject/sdk-core/lib/IAkashaModule';

const IPFS = require('ipfs');

const registerService: AkashaServiceFactory = function(di: DIContainer): AkashaService {
  const service = async function() {
    const service = new IPFS({ config: ipfsSettings, start: false });
    return () => service;
  };
  return { service, name: IPFS_SERVICE };
};

export default registerService;
