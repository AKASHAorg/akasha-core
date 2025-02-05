import getSDK from '@akashaorg/core-sdk';
import { filter } from 'rxjs';
import { GlobalEventBusData, WEB3_EVENTS } from '@akashaorg/typings/lib/sdk';
import React, { useEffect, useState } from 'react';
import { logError } from './utils/error-handler';

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

const getCurrentNetwork = () => {
  const sdk = getSDK();
  const res = sdk.services.common.web3.network;
  return res;
};

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
  const [data, setData] = useState<{
    name: string;
    chainId: string;
  }>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRequiredNetwork();
        if (res) {
          setData(res);
          setIsLoading(false);
          setIsSuccess(true);
        }
      } catch (err) {
        setError(err);
        logError('useRequiredNetwork', err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error, isSuccess };
}

export function useNetworkChangeListener() {
  const [currentNetwork, setCurrentNetwork] = React.useState(null);
  const globalChannel = getSDK().api.globalChannel;
  const call = globalChannel.pipe(filter(data => data.event === WEB3_EVENTS.CHAIN_CHANGED));
  const sub = call.subscribe((event: GlobalEventBusData<{ chainId: number | string }>) => {
    if (!currentNetwork || currentNetwork.chainId !== event.data?.chainId) {
      setCurrentNetwork(event.data);
    }
  });
  const unsubscribe = () => {
    sub.unsubscribe();
  };
  return [currentNetwork, unsubscribe];
}
