import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { registerServiceMethods, toNamedService } from '@akashaproject/sdk-core/lib/utils';
import { IPFS_SERVICE } from './constants';
import ipfsSettings from './ipfs.settings';

// tslint:disable-next-line:no-var-requires
const IPFS = require('ipfs');

const service: AkashaService = (sI, log) => {
  let ipfsNode;
  const getInstance = async (refresh: boolean = false) => {
    if (ipfsNode && !refresh) {
      log.info('reusing existing ipfs instance');
      return ipfsNode;
    }
    ipfsNode = await IPFS.create({ start: false });
    log.info('ipfs node instantiated');
    return ipfsNode;
  };
  return registerServiceMethods({ getInstance });
};
export default toNamedService(IPFS_SERVICE, service);
