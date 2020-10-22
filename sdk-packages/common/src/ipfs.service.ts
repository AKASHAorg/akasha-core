import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { IPFS_SERVICE } from './constants';
import ipfsMethods from './ipfs.methods';
import { ipfsGateway } from './ipfs.settings';
// tslint:disable-next-line:no-var-requires
const Ipfs = require('ipfs');

const service: AkashaService = (invoke, log) => {
  let ipfsNode;

  const getUtils = async () => {
    return Ipfs;
  };

  const getInstance = async (refresh: boolean = false, ipfsInstance?: any) => {
    if (ipfsNode && !refresh) {
      log.info('reusing existing ipfs instance');
      return ipfsNode;
    }

    if (!ipfsInstance) {
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

  const upload = async (
    data: {
      content: Buffer | ArrayBuffer | string | any;
      isUrl?: boolean;
      path?: string;
    }[],
  ) => {
    return ipfsMethods.add(data, { getInstance, getUtils }, log);
  };

  const getSettings = async () => {
    return ipfsGateway;
  };

  const dagGet = async (cid: string, path: string) => {
    const ipfs = await getInstance();
    const result = await ipfs.dag.get(cid, { path });
    return result.value;
  };

  return { getInstance, getUtils, upload, getSettings, dagGet };
};
export default { service, name: IPFS_SERVICE };
