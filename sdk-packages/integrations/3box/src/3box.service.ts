import Box from '3box';
import commonServices, { IPFS_SERVICE } from '@akashaproject/sdk-common/lib/constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { registerServiceMethods, toNamedService } from '@akashaproject/sdk-core/lib/utils';
import { BOX_SERVICE } from './constants';

const service: AkashaService = invoke => {
  const getProfile = async (ethAddress: string) => {
    const ipfs = invoke(commonServices[IPFS_SERVICE]);
    // tslint:disable-next-line:no-console
    console.log(Box, 'box');
    return Box.getProfile(ethAddress, { ipfs });
  };

  return registerServiceMethods({ getProfile });
};
export default toNamedService(BOX_SERVICE, service);
