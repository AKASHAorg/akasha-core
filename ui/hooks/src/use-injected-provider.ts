import { lastValueFrom } from 'rxjs';
import { useMutation, useQuery } from 'react-query';

import getSDK from '@akashaproject/awf-sdk';
import { EthProviders } from '@akashaproject/sdk-typings/lib/interfaces';
import { INJECTED_PROVIDERS } from '@akashaproject/sdk-typings/lib/interfaces/common';

import constants from './constants';
import { logError } from './utils/error-handler';
import getProviderDetails from './utils/getProviderDetails';

const { INJECTED_PROVIDER_KEY, REQUIRED_NETWORK_KEY } = constants;

const getInjectedProvider = async () => {
  const sdk = getSDK();
  const provider = await lastValueFrom(sdk.services.common.web3.detectInjectedProvider());

  // get detected provider details
  const details = getProviderDetails(provider.data);

  return { name: provider.data, details };
};

const connectProvider = async (provider: EthProviders) => {
  const sdk = getSDK();
  return await sdk.services.common.web3.connect(provider);
};

const getRequiredNetwork = async () => {
  const sdk = getSDK();
  const networkName = await lastValueFrom(sdk.services.common.web3.getRequiredNetworkName());
  return networkName.data;
};

/**
 * An utility function to switch to required network - Metamask
 * */
export const switchToRequiredNetwork = async () => {
  const sdk = getSDK();
  await lastValueFrom(sdk.services.common.web3.switchToRequiredNetwork());
};

/**
 * A hook to get injected provider from the SDK
 * */
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
 * A hook to connect to injected provider
 * @param provider -: any of type EthProviders
 * */
export function useConnectProvider() {
  return useMutation(async (provider: EthProviders) => connectProvider(provider));
}

/**
 * A hook to get required network name from the SDK
 * */
export function useRequiredNetworkName() {
  return useQuery([REQUIRED_NETWORK_KEY], () => getRequiredNetwork(), {
    initialData: 'required',
    keepPreviousData: true,
  });
}
