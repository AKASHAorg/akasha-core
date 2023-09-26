import { useQuery } from '@tanstack/react-query';
import getSDK from '@akashaorg/awf-sdk';
import { INJECTED_PROVIDERS, WEB3_EVENTS } from '@akashaorg/typings/lib/sdk';
import { logError } from './utils/error-handler';

export const INJECTED_PROVIDER_KEY = 'INJECTED_PROVIDER';

const getInjectedProvider = async () => {
  const sdk = getSDK();
  const provider = await sdk.services.common.web3.detectInjectedProvider();

  return provider.data;
};

/**
 * A utility function to disconnect from currently connected network
 */
export const disconnectProvider = async () => {
  const sdk = getSDK();
  return sdk.services.common.web3.disconnect();
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
