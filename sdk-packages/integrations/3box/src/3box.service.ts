import Box from '3box';
import commonServices, {
  IPFS_SERVICE,
  WEB3_SERVICE,
} from '@akashaproject/sdk-common/lib/constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { registerServiceMethods, toNamedService } from '@akashaproject/sdk-core/lib/utils';
import { BOX_SERVICE } from './constants';

const service: AkashaService = (invoke, log) => {
  let box: Box;
  const getProfile = async (ethAddress: string) => {
    log.info('fetching profile for', ethAddress);
    const ipfs = invoke(commonServices[IPFS_SERVICE]);
    return Box.getProfile(ethAddress, { ipfs });
  };

  const authenticate = async (refresh: boolean = false) => {
    if (box && !refresh) {
      return box;
    }
    log.info('getting the ethAddress for the current signer');
    const ethersService = invoke(commonServices[WEB3_SERVICE]);
    const provider = ethersService.getWeb3Instance();
    // @todo: issue here, not found every time
    log.info('found web3 provider', provider);
    const signer = await provider.getSigner();
    const ethAddress = await signer.getAddress();
    const ipfs = invoke(commonServices[IPFS_SERVICE]);
    log.info('opening Box for', ethAddress);
    box = await Box.openBox(ethAddress, provider, { ipfs });
    return box;
  };
  return registerServiceMethods({ getProfile, authenticate });
};
export default toNamedService(BOX_SERVICE, service);
