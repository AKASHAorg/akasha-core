import { useQuery } from '@tanstack/react-query';
import getSDK from '@akashaorg/awf-sdk';

export const NETWORK_STATE_KEY = 'Network_State';
export const CURRENT_NETWORK_KEY = 'Current Network';

const checkNetworkState = async () => {
  const sdk = getSDK();
  const res = { networkNotSupported: false };
  try {
    await sdk.services.common.web3.checkCurrentNetwork();
  } catch (error) {
    res.networkNotSupported = true;
  }
  return res;
};

/**
 * Hook to check if the web3 provider is set to function on the Rinkeby test network
 * @returns networkNotSupported: true if web3 provider is not on the specified network
 * @example useNetworkState hook
 * ```typescript
 * const networkStateQuery = useNetworkState(true);
 *
 * const networkNotSupported = networkStateQuery.data.networkNotSupported;
 * ```
 */
export function useNetworkState(enabler?: boolean) {
  return useQuery([NETWORK_STATE_KEY], () => checkNetworkState(), {
    initialData: { networkNotSupported: true },
    enabled: !!enabler,
    keepPreviousData: true,
  });
}

const getCurrentNetwork = () => {
  const sdk = getSDK();
  const res = sdk.services.common.web3.network;
  return res;
};

/**
 * Hook to check the user's current web3 network
 * @returns network name
 * @example useCurrentNetwork hook
 * ```typescript
 * const currentNetworkQuery = useCurrentNetwork(true);
 *
 * const network = currentNetworkQuery.data;
 * ```
 */
export function useCurrentNetwork(enabler?: boolean) {
  return useQuery([CURRENT_NETWORK_KEY], () => getCurrentNetwork(), {
    enabled: enabler,
    keepPreviousData: true,
  });
}
