import { lastValueFrom } from 'rxjs';
import { useQuery } from 'react-query';

import getSDK from '@akashaorg/awf-sdk';
import { INJECTED_PROVIDERS, EthProviders } from '@akashaorg/typings/sdk';

import constants from './constants';
import { logError } from './utils/error-handler';
import getProviderDetails from './utils/getProviderDetails';

const { INJECTED_PROVIDER_KEY, CONNECT_PROVIDER_KEY, REQUIRED_NETWORK_KEY } = constants;

const getInjectedProvider = async () => {
  const sdk = getSDK();
  const provider = await lastValueFrom(sdk.services.common.web3.detectInjectedProvider());

  // get detected provider details
  const details = getProviderDetails(provider.data);

  return { name: provider.data, details };
};

const connectProvider = async (provider: EthProviders) => {
  const sdk = getSDK();
  return sdk.services.common.web3.connect(provider);
};

const getRequiredNetwork = async () => {
  const sdk = getSDK();
  const networkName = await lastValueFrom(sdk.services.common.web3.getRequiredNetworkName());
  return networkName.data;
};

/**
 * An utility function to switch to required network - Metamask
 */
export const switchToRequiredNetwork = async () => {
  const sdk = getSDK();
  await lastValueFrom(sdk.services.common.web3.switchToRequiredNetwork());
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
    initialData: {
      name: INJECTED_PROVIDERS.NOT_DETECTED,
      details: {
        iconType: '',
        titleLabel: '',
        subtitleLabel: '',
      },
    },
    onError: (err: Error) => logError('[use-injected-provider.ts]: useInjectedProvider err', err),
  });
}

/**
 * Hook to connect with one of the supported providers
 * @example useConnectProvider hook
 * ```typescript
 * const connectProviderQuery = useConnectProvider('selectedProvider');
 *
 * // can be used as enabler for useNetworkState hook; so this check works only if provider has been connected.
 * const networkStateQuery = useNetworkState(connectProviderQuery.data);
 * ```
 */
export function useConnectProvider(provider: EthProviders) {
  return useQuery([CONNECT_PROVIDER_KEY], () => connectProvider(provider), {
    enabled: provider !== EthProviders.None,
    keepPreviousData: true,
    retry: false,
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
    initialData: 'required',
    keepPreviousData: true,
  });
}
