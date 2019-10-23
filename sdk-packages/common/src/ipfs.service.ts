import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import commonServices, { CACHE_SERVICE, IPFS_SERVICE } from './constants';
// import ipfsSettings from './ipfs.settings';

// tslint:disable-next-line:no-var-requires
const IPFS = require('ipfs');

const service: AkashaService = (invoke, log) => {
  const getInstance = async (refresh: boolean) => {
    let ipfsNode;
    const stash: any = await invoke(commonServices[CACHE_SERVICE]).getStash();
    ipfsNode = stash.get(commonServices[IPFS_SERVICE]);
    if (ipfsNode && !refresh) {
      log.info('reusing existing ipfs instance');
      return ipfsNode;
    }
    ipfsNode = await IPFS.create({ start: false });
    stash.set(commonServices[IPFS_SERVICE], ipfsNode);
    log.info('ipfs node instantiated');
    return ipfsNode;
  };
  return { getInstance };
};
export default { name: IPFS_SERVICE, service };
