import { useQuery } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';

export const NETWORK_STATE_KEY = 'Network_State';

const checkNetworkState = async () => {
  const sdk = getSDK();
  const res = { networkNotSupported: false };
  try {
    await lastValueFrom(sdk.services.common.web3.checkCurrentNetwork());
  } catch (error) {
    res.networkNotSupported = true;
  }
  return res;
};

export function useNetworkState(loggedEthAddress: string | null) {
  return useQuery([NETWORK_STATE_KEY], () => checkNetworkState(), {
    enabled: !!loggedEthAddress,
    keepPreviousData: true,
  });
}
