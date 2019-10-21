import Box from '3box';
import commonServices, {
  CACHE_SERVICE,
  IPFS_SERVICE,
  WEB3_SERVICE,
  WEB3_UTILS_SERVICE,
} from '@akashaproject/sdk-common/lib/constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { registerServiceMethods, toNamedService } from '@akashaproject/sdk-core/lib/utils';
import boxServices, { BOX_SERVICE } from './constants';

const service: AkashaService = (invoke, log) => {
  // fetch a 3box profile from profile server :D
  // it doesn't require any connection to metamask or ipfs
  const getProfile = async (ethAddress: string) => {
    log.info('fetching profile for', ethAddress);
    const ipfs = await invoke(commonServices[IPFS_SERVICE]).getInstance();
    return Box.getProfile(ethAddress, { ipfs });
  };

  const authenticate = async (refresh?: boolean) => {
    let box: Box;
    // fetch existing Box instance
    const cacheService = invoke(commonServices[CACHE_SERVICE]);
    const stash = await cacheService.getStash();
    box = stash.get(boxServices[BOX_SERVICE]);
    if (box && !refresh) {
      return box;
    }
    log.info('getting the ethAddress for the current signer');
    const ethersService = invoke(commonServices[WEB3_SERVICE]);
    const ethersUtils = invoke(commonServices[WEB3_UTILS_SERVICE]);
    const utils = await ethersUtils.getUtils();
    const provider = await ethersService.getWeb3Instance();
    const signer = await provider.getSigner();
    const ethAddress = await signer.getAddress();
    // const ipfs = await invoke(commonServices[IPFS_SERVICE]).getInstance();
    log.info('opening Box for', ethAddress);
    box = await Box.openBox(
      ethAddress,
      // @todo: remove this when 3box is compatible with ethers.js
      {
        sendAsync: function(data, cb) {
          signer.signMessage(utils.toUtf8String(data.params[0])).then(result => {
            cb(null, { result });
          });
        },
      },
    );
    // update the cache
    stash.set(boxServices[BOX_SERVICE], box);
    return box;
  };
  return registerServiceMethods({ getProfile, authenticate });
};
export default toNamedService(BOX_SERVICE, service);
