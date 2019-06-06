import { ICommonSettings } from '@akashaproject/sdk-core/lib/settings';
import { ipfsGateway } from './ipfs.settings';

// ethereum chain id
export const ETH_NETWORK = 'eth_network';
// used for displaying images
export const IPFS_GATEWAY = 'ipfs_gateway';
// value to check when the web3 connector should connect to the existing web3 provider(like Metamask)
export const CONNECT_EXISTING = 'connect_existing_web3_provider';

const settings: ICommonSettings = [
  [ETH_NETWORK, 'rinkeby'],
  [IPFS_GATEWAY, ipfsGateway]
];

export default settings;
