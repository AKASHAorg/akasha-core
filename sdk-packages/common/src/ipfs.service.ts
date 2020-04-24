import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { IPFS_SERVICE } from './constants';
import ipfsMethods from './ipfs.methods';
// import ipfsSettings from './ipfs.settings';

const service: AkashaService = (invoke, log) => {
  let ipfsNode;
  let utils;
  //
  const getUtils = async (ipfsUtils?: any) => {
    if (ipfsUtils && !utils) {
      log.info('using provided ipfsUtils');
      utils = ipfsUtils;
    }

    if (!utils && !ipfsUtils && window.hasOwnProperty('Ipfs')) {
      // @ts-ignore
      const { Ipfs } = window;
      utils = Ipfs;
    }
    return utils;
  };
  //
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
  //
  const upload = async (
    data: {
      content: Buffer | ArrayBuffer | string | any;
      isUrl?: boolean;
      path?: string;
    }[],
  ) => {
    return ipfsMethods.add(data, { getInstance, getUtils }, log);
  };
  return { getInstance, getUtils, upload };
};
export default { service, name: IPFS_SERVICE };
