import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getSDK from '@akashaorg/awf-sdk';
import { ProfileProviderProperties, ProfileProviders } from '@akashaorg/typings/ui';
import { logError } from './utils/error-handler';
import { PROFILE_KEY } from './use-profile';
import { Profile } from '@akashaorg/typings/ui';

export const UPDATE_USERNAME_PROVIDER_KEY = 'UPDATE_USERNAME_PROVIDER';
export const REGISTER_ENS_KEY = 'REGISTER_ENS';
export const GET_ENS_BY_ADDRESS_KEY = 'GET_ENS_BY_ADDRESS';
export const VALIDATE_USERNAME_KEY = 'VALIDATE_USERNAME_KEY';

const updateUsernameProvider = async (
  payload: {
    userName: string;
    provider: ProfileProviders;
    pubKey: string;
  },
  queryClient: QueryClient,
) => {
  const sdk = getSDK();
  const profile = queryClient.getQueryData<Profile>([PROFILE_KEY, payload.pubKey]);
  if (!profile) {
    return logError(
      `use-username.updateUsernameProvider`,
      new Error(`no profile with pubKey: ${payload.pubKey}`),
    );
  }
  const providerData = {
    provider: payload.provider,
    property: ProfileProviderProperties.USERNAME,
    value: payload.userName,
  };

  // if (!profile.providers.length || !profile.providers.find(p => p.provider === payload.provider)) {
  //   // profile does not have this provider yet!
  //   try {
  //     const addProviderRes = await sdk.api.profile.addProfileProvider([providerData]);
  //     if (!addProviderRes) {
  //       logError(
  //         `use-username.updateUsernameProvider`,
  //         new Error(`No data received from addProfileProvider call`),
  //       );
  //       throw new Error(`Something went wrong when saving username.`);
  //     }
  //   } catch (error) {
  //     logError('use-username.addProfileProvider', error);
  //     throw error;
  //   }
  // }
  try {
    const makeDefaultRes = await sdk.api.profile.makeDefaultProvider([providerData]);
    return makeDefaultRes;
  } catch (error) {
    logError('use-username.makeDefaultProvider', error);
    throw error;
  }
};

/**
 * Hook to register a username for the user.
 * Pass as payload, the username and provider details to the mutate function
 * @example useUpdateUsernameProvider hook
 * ```typescript
 * const updateUsernameProviderQuery = useUpdateUsernameProvider('logged-in-user-pubkey');
 *
 * // do something with the returned status of the query
 * React.useEffect(()=> {
 * if (updateUsernameProviderQuery.status === 'success') {
      // perform an action
    }
 * }, [updateUsernameProviderQuery])
 * ```
 */
export function useUpdateUsernameProvider(pubKey?: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: { userName: string; provider: ProfileProviders }) =>
      updateUsernameProvider({ ...payload, pubKey }, queryClient),
    {
      onMutate: (payload: { userName: string; provider: ProfileProviders }) => {
        const providerData = {
          provider: payload.provider,
          property: ProfileProviderProperties.USERNAME,
          value: payload.userName,
        };
        if (pubKey) {
          const currentProfile = queryClient.getQueryData<Profile>([PROFILE_KEY, pubKey]);

          queryClient.setQueryData<Profile>([PROFILE_KEY, pubKey], {
            ...currentProfile,
            // providers: [...currentProfile.providers, providerData],
            // default: [
            //   ...currentProfile.default.filter(
            //     p => p.property !== ProfileProviderProperties.USERNAME,
            //   ),
            //   providerData,
            // ],
          });

          return { currentProfile };
        }
      },
      onError: (error: Error, variables, context) => {
        if (pubKey && context.currentProfile) {
          // rollback changes
          queryClient.setQueryData<Profile>([PROFILE_KEY, pubKey], context.currentProfile);
        }
        logError('useUsername.useUpdateUsernameProvider.onError', error);
      },
      mutationKey: [UPDATE_USERNAME_PROVIDER_KEY],
    },
  );
}

const registerENS = async ({ userName }: { userName: string }) => {
  const sdk = getSDK();
  const providerData = {
    provider: ProfileProviders.ENS,
    property: ProfileProviderProperties.USERNAME,
    value: userName.replace('@', ''),
  };
  try {
    const registerRes = await sdk.api.ens.registerName(
      `${userName.replace('@', '').replace('.akasha.eth', '')}`,
    );
    if (!registerRes.data) {
      logError('useProfile.registerENS', new Error('Cannot register username.'));
      throw new Error('Cannot register username.');
    }
    const addProviderRes = await sdk.api.profile.addProfileProvider([providerData]);
    if (!addProviderRes) {
      logError('useProfile.registerENS', new Error('Cannot add username provider.'));
      throw new Error('Cannot add username provider.');
    }

    const makeDefaultRes = await sdk.api.profile.makeDefaultProvider([providerData]);
    return makeDefaultRes;
  } catch (error) {
    logError('use-username.registerENS', error);
    throw error;
  }
};

/**
 * Hook to register a new ENS name.
 * Pass as payload, the username to the mutate function
 * @example useEnsRegistration hook
 * ```typescript
 * const registerEnsQuery = useEnsRegistration('logged-in-user-pubkey');
 *
 * // do something with the returned status of the query
 * React.useEffect(()=> {
 * if (registerEnsQuery.status === 'success') {
      // perform an action
    }
 * }, [registerEnsQuery])
 * ```
 */
export function useEnsRegistration(pubKey?: string) {
  const queryClient = useQueryClient();
  return useMutation(registerENS, {
    mutationKey: [REGISTER_ENS_KEY],
    onMutate: ({ userName }: { userName: string }) => {
      // optimistic update only if pubKey is provided
      const providerData = {
        provider: ProfileProviders.ENS,
        property: ProfileProviderProperties.USERNAME,
        value: userName.replace('@', ''),
      };
      const currentProfile = queryClient.getQueryData<Profile>([PROFILE_KEY, pubKey]);
      if (pubKey) {
        if (!currentProfile) {
          logError(
            `use-username.useEnsRegistration`,
            new Error(`no profile with pubKey: ${pubKey}`),
          );
        }
        queryClient.setQueryData<Profile>([PROFILE_KEY, pubKey], {
          ...currentProfile,
          // providers: [...currentProfile.providers, providerData],
          // default: [
          //   ...currentProfile.default.filter(
          //     p => p.property !== ProfileProviderProperties.USERNAME,
          //   ),
          //   providerData,
          // ],
        });
      }
      return { currentProfile };
    },
    onError: (error: Error, variables, context) => {
      if (pubKey) {
        // rollback the changes
        queryClient.setQueryData<Profile>([PROFILE_KEY, pubKey], context.currentProfile);
      }
      logError('use-username.useEnsRegistration.onError', error);
    },
  });
}

const validateUsername = async (username: string) => {
  const sdk = getSDK();
  try {
    const res = await sdk.api.ens.isAvailable(username);
    return res.isUserNameAvailable;
  } catch (error) {
    logError('useProfile.validateUsername', error);
    throw error;
  }
};

/**
 * Hook to check if a username is available
 * @example useUsernameValidation hook
 * ```typescript
 * const usernameValidationQuery = useUsernameValidation('awesomeusername', true);
 *
 * // do something with the returned status of the query
 * const querySuccess =  usernameValidationQuery.isSuccess
 * ```
 */
export function useUsernameValidation(username: string, enabler = true) {
  return useQuery([VALIDATE_USERNAME_KEY, username], async () => validateUsername(username), {
    enabled: enabler && !!username,
  });
}

/**
 * Hook to resolve an ethereum address to an ENS name
 * @example useEnsByAddress hook
 * ```typescript
 * const ensByAddressQuery = useEnsByAddress('logged-in-user-eth-address');
 *
 * // do something with the returned status of the query
 * const querySuccess =  ensByAddressQuery.isSuccess
 * ```
 */
export function useEnsByAddress(ethAddress: string) {
  return useQuery(
    [GET_ENS_BY_ADDRESS_KEY, ethAddress],
    async () => {
      const sdk = getSDK();
      const res = await sdk.api.ens.resolveAddress(ethAddress);
      return res.data;
    },
    {
      enabled: !!ethAddress,
      onError: (err: Error) => logError('useUsername.useEnsByAddress', err),
    },
  );
}
