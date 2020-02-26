import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { IPFS_SERVICE } from './constants';
// import ipfsSettings from './ipfs.settings';

const service: AkashaService = (invoke, log) => {
  let ipfsNode;
  const getInstance = async (refresh: boolean = false, ipfsInstance: any) => {
    if (ipfsNode && !refresh) {
      log.info('reusing existing ipfs instance');
      return ipfsNode;
    }

    if (!ipfsInstance && window.hasOwnProperty('Ipfs')) {
      // @ts-ignore
      const { Ipfs } = window;
      ipfsNode = await Ipfs.create();
      log.info('ipfs node instantiated');
    }

    if (!ipfsNode && ipfsInstance) {
      log.info('using provided ipfs instance');
      ipfsNode = ipfsInstance;
    }

    return ipfsNode;
  };
  return { getInstance };
};
export default { service, name: IPFS_SERVICE };
