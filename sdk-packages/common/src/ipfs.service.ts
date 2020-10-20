import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { IPFS_SERVICE } from './constants';
import ipfsMethods from './ipfs.methods';
// tslint:disable-next-line:no-var-requires
const Ipfs = require('ipfs');
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
      // const { Ipfs } = window;
      utils = Ipfs;
    }
    return utils;
  };
  //
  const getInstance = async (refresh: boolean = false, ipfsInstance?: any) => {
    if (ipfsNode && !refresh) {
      log.info('reusing existing ipfs instance');
      return ipfsNode;
    }

    if (!ipfsInstance) {
      // @ts-ignore
      // const { Ipfs } = window;
      ipfsNode = await Ipfs.create({
        repo: 'ewaAlpha',
        config: {
          Addresses: {
            Swarm: [
              '/dns4/akasha.cloud/tcp/443/wss/p2p-webrtc-star/',
              '/ip4/207.154.192.173/tcp/9096/p2p/QmV5i4xsCmuFzTs6FBxMb6H4kpjRTyomL7AbZZdqEAoDUg',
            ],
          },
        },
      });
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

  const dagGet = async (cid: string, path: string) => {
    const ipfs = await getInstance();
    const result = await ipfs.dag.get(cid, { path });
    return result.value;
  };

  return { getInstance, getUtils, upload, dagGet };
};
export default { service, name: IPFS_SERVICE };
