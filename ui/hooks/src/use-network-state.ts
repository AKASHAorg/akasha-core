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

/**
 * Hook to check if the web3 provider is set to function on the Rinkeby test network
 * @returns networkNotSupported: true if web3 provider on another network
 */
export function useNetworkState(enabler?: boolean) {
  return useQuery([NETWORK_STATE_KEY], () => checkNetworkState(), {
    enabled: !!enabler,
    keepPreviousData: true,
  });
}
