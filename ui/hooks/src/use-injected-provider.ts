import { lastValueFrom } from 'rxjs';
import { useQuery } from 'react-query';

import getSDK from '@akashaproject/awf-sdk';
import { EthProviders } from '@akashaproject/sdk-typings/lib/interfaces';
import { INJECTED_PROVIDERS } from '@akashaproject/sdk-typings/lib/interfaces/common';

import constants from './constants';
import { logError } from './utils/error-handler';
import getProviderDetails from './utils/getProviderDetails';

const { INJECTED_PROVIDER_KEY, CONNECT_PROVIDER_KEY } = constants;

const getInjectedProvider = async () => {
  const sdk = getSDK();
  const provider = await lastValueFrom(sdk.services.common.web3.detectInjectedProvider());

  // get detected provider details
  const details = getProviderDetails(provider.data);

  return { name: provider.data, details };
};

const connectProvider = async (provider: EthProviders) => {
  const sdk = getSDK();
  await sdk.services.common.web3.connect(provider);
};

/* A hook to get injected provider from the SDK */
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

export function useConnectProvider(provider: EthProviders) {
  return useQuery([CONNECT_PROVIDER_KEY], () => connectProvider(provider), {
    enabled: provider !== EthProviders.None,
    keepPreviousData: true,
  });
}
