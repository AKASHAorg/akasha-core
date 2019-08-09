import { IGeneralSettings } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { ETH_NETWORK, IPFS_GATEWAY } from './constants';
import { ipfsGateway } from './ipfs.settings';

const settings: IGeneralSettings = [[ETH_NETWORK, 'rinkeby'], [IPFS_GATEWAY, ipfsGateway]];

export default settings;
