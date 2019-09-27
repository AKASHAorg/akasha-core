import Box from '3box';
import commonServices, {
  IPFS_SERVICE,
  WEB3_SERVICE,
  WEB3_UTILS_SERVICE,
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

  const authenticate = async (refresh?: boolean) => {
    if (box && !refresh) {
      return box;
    }
    log.info('getting the ethAddress for the current signer');
    const ethersService = invoke(commonServices[WEB3_SERVICE]);
    const ethersUtils = invoke(commonServices[WEB3_UTILS_SERVICE]);
    const utils = ethersUtils.utils();
    const provider = ethersService.getWeb3Instance();
    const signer = await provider.getSigner();
    const ethAddress = await signer.getAddress();
    // const ipfs = invoke(commonServices[IPFS_SERVICE]);
    log.info('opening Box for', ethAddress);
    box = await Box.openBox(
      ethAddress,
      // @todo: remove this when 3box is compatible with ethers.js
      {
        sendAsync: function(data, cb) {
          signer
            .signMessage(utils.toUtf8String(data.params[0]))
            .then(result => cb(null, { result: utils.joinSignature(result) }));
        },
      },
    );
    return box;
  };
  return registerServiceMethods({ getProfile, authenticate });
};
export default toNamedService(BOX_SERVICE, service);
