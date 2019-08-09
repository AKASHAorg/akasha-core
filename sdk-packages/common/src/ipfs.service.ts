import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import {
  createServiceMethod,
  registerServiceMethods,
  toNamedService
} from '@akashaproject/sdk-core/lib/utils';
import { IPFS_SERVICE } from './constants';
import ipfsSettings from './ipfs.settings';

// tslint:disable-next-line:no-var-requires
const IPFS = require('ipfs');

const service: AkashaService = () => {
  const ipfsNode = new IPFS({ config: ipfsSettings, start: false });
  return registerServiceMethods({ ipfsNode: createServiceMethod(ipfsNode) });
};
export default toNamedService(IPFS_SERVICE, service);
