import { useQuery } from '@tanstack/react-query';

import getSDK from '@akashaorg/awf-sdk';
import { INJECTED_PROVIDERS } from '@akashaorg/typings/sdk';

import constants from './constants';
import { logError } from './utils/error-handler';

const { INJECTED_PROVIDER_KEY, REQUIRED_NETWORK_KEY } = constants;

const getInjectedProvider = async () => {
  const sdk = getSDK();
  const provider = await sdk.services.common.web3.detectInjectedProvider();

  return provider.data;
};

const getRequiredNetwork = async () => {
  const sdk = getSDK();
  const networkName = sdk.services.common.web3.getRequiredNetworkName();
  return networkName.data;
};

/**
 * A utility function to disconnect from currently connected network
 */
export const disconnectProvider = async () => {
  const sdk = getSDK();
  return sdk.services.common.web3.disconnect();
};
/**
 * A utility function to switch to required network - Metamask
 */
export const switchToRequiredNetwork = async () => {
  const sdk = getSDK();
  await sdk.services.common.web3.switchToRequiredNetwork();
};

/**
 * A hook to get injected provider from the SDK
 * @example useInjectedProvider hook
 * ```typescript
 * const injectedProviderQuery = useInjectedProvider('selectedProvider');
 *
 * const injectedProvider = React.useMemo(
 () => injectedProviderQuery.data,
 [injectedProviderQuery.data],
 );
 * ```
 */
export function useInjectedProvider() {
  return useQuery([INJECTED_PROVIDER_KEY], () => getInjectedProvider(), {
    initialData: INJECTED_PROVIDERS.NOT_DETECTED,
    onError: (err: Error) => logError('[use-injected-provider.ts]: useInjectedProvider err', err),
  });
}

/**
 * A hook to get required network name from the SDK
 * @example useRequiredNetworkName hook
 * ```typescript
 * const requiredNetworkQuery = useRequiredNetworkName();
 *
 * const requiredNetworkName = requiredNetworkQuery.data;
 * ```
 */
export function useRequiredNetworkName() {
  return useQuery([REQUIRED_NETWORK_KEY], () => getRequiredNetwork(), {
    keepPreviousData: true,
  });
}
