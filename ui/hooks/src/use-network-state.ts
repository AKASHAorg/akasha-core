import { useQuery } from '@tanstack/react-query';
import getSDK from '@akashaorg/awf-sdk';
import { filter } from 'rxjs';
import { GlobalEventBusData, WEB3_EVENTS } from '@akashaorg/typings/sdk';
import constants from './constants';
import React from 'react';

export const NETWORK_STATE_KEY = 'Network_State';
export const CURRENT_NETWORK_KEY = 'Current Network';

const { REQUIRED_NETWORK_KEY } = constants;

/**
 * A utility function to switch to required network for supported wallets
 */
export const switchToRequiredNetwork = async () => {
  const sdk = getSDK();
  await sdk.services.common.web3.switchToRequiredNetwork();
};

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

const getRequiredNetwork = async () => {
  const sdk = getSDK();
  const networkName = sdk.services.common.web3.getRequiredNetwork();
  return networkName.data;
};

/**
 * A hook to get required network name from the SDK
 * @example useRequiredNetworkName hook
 * ```typescript
 * const requiredNetworkQuery = useRequiredNetworkName();
 *
 * const requiredNetworkName = requiredNetworkQuery.data;
 * ```
 */
export function useRequiredNetwork() {
  return useQuery([REQUIRED_NETWORK_KEY], () => getRequiredNetwork(), {
    keepPreviousData: true,
  });
}

export function useNetworkChangeListener() {
  const [currentNetwork, setCurrentNetwork] = React.useState(null);
  const globalChannel = getSDK().api.globalChannel;
  const call = globalChannel.pipe(filter(data => data.event === WEB3_EVENTS.CHAIN_CHANGED));
  const sub = call.subscribe((event: GlobalEventBusData<{ chainId: number }>) => {
    if (!currentNetwork || currentNetwork.chainId !== event.data?.chainId) {
      setCurrentNetwork(event.data);
    }
  });
  return currentNetwork;
}
