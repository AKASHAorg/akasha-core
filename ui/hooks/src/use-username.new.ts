import { QueryClient, useMutation, useQuery, useQueryClient } from 'react-query';
import getSDK from '@akashaproject/awf-sdk';
import {
  IProfileData,
  ProfileProviderProperties,
  ProfileProviders,
} from '@akashaproject/ui-awf-typings/lib/profile';
import { logError } from './utils/error-handler';
import { PROFILE_KEY } from './use-profile.new';
import { lastValueFrom } from 'rxjs';

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
  const profile = queryClient.getQueryData<IProfileData>([PROFILE_KEY, payload.pubKey]);
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

  if (!profile.providers.length || !profile.providers.find(p => p.provider === payload.provider)) {
    // profile does not have this provider yet!
    try {
      const addProviderRes = await lastValueFrom(
        sdk.api.profile.addProfileProvider([providerData]),
      );
      if (!addProviderRes.data) {
        logError(
          `use-username.updateUsernameProvider`,
          new Error(`No data received from addProfileProvider call`),
        );
        throw new Error(`Something went wrong when saving username.`);
      }
    } catch (error) {
      logError('use-username.addProfileProvider', error);
      throw error;
    }
  }
  try {
    const makeDefaultRes = await lastValueFrom(sdk.api.profile.makeDefaultProvider([providerData]));
    return makeDefaultRes.data;
  } catch (error) {
    logError('use-username.makeDefaultProvider', error);
    throw error;
  }
};
export function useUpdateUsernameProvider(pubKey?: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: { userName: string; provider: ProfileProviders }) =>
      await updateUsernameProvider({ ...payload, pubKey }, queryClient),
    {
      onMutate: (payload: { userName: string; provider: ProfileProviders }) => {
        const providerData = {
          provider: payload.provider,
          property: ProfileProviderProperties.USERNAME,
          value: payload.userName,
        };
        if (pubKey) {
          const currentProfile = queryClient.getQueryData<IProfileData>([PROFILE_KEY, pubKey]);

          queryClient.setQueryData<IProfileData>([PROFILE_KEY, pubKey], {
            ...currentProfile,
            providers: [...currentProfile.providers, providerData],
            default: [
              ...currentProfile.default.filter(
                p => p.property !== ProfileProviderProperties.USERNAME,
              ),
              providerData,
            ],
          });

          return { currentProfile };
        }
      },
      onError: (error: Error, variables, context) => {
        if (pubKey && context.currentProfile) {
          // rollback changes
          queryClient.setQueryData<IProfileData>([PROFILE_KEY, pubKey], context.currentProfile);
        }
        logError('useUsername.useUpdateUsernameProvider.onError', error);
      },
      mutationKey: UPDATE_USERNAME_PROVIDER_KEY,
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
    const registerRes = await lastValueFrom(
      sdk.api.ens.registerName(`${userName.replace('@', '').replace('.akasha.eth', '')}`),
    );
    if (!registerRes.data) {
      logError('useProfile.registerENS', new Error('Cannot register username.'));
      throw new Error('Cannot register username.');
    }
    const addProviderRes = await lastValueFrom(sdk.api.profile.addProfileProvider([providerData]));
    if (!addProviderRes.data) {
      logError('useProfile.registerENS', new Error('Cannot add username provider.'));
      throw new Error('Cannot add username provider.');
    }

    const makeDefaultRes = await lastValueFrom(sdk.api.profile.makeDefaultProvider([providerData]));
    return makeDefaultRes.data;
  } catch (error) {
    logError('use-username.registerENS', error);
    throw error;
  }
};

export function useEnsRegistration(pubKey?: string) {
  const queryClient = useQueryClient();
  return useMutation(registerENS, {
    mutationKey: REGISTER_ENS_KEY,
    onMutate: ({ userName }: { userName: string }) => {
      // optimistic update only if pubKey is provided
      const providerData = {
        provider: ProfileProviders.ENS,
        property: ProfileProviderProperties.USERNAME,
        value: userName.replace('@', ''),
      };
      const currentProfile = queryClient.getQueryData<IProfileData>([PROFILE_KEY, pubKey]);
      if (pubKey) {
        if (!currentProfile) {
          logError(
            `use-username.useEnsRegistration`,
            new Error(`no profile with pubKey: ${pubKey}`),
          );
        }
        queryClient.setQueryData<IProfileData>([PROFILE_KEY, pubKey], {
          ...currentProfile,
          providers: [...currentProfile.providers, providerData],
          default: [
            ...currentProfile.default.filter(
              p => p.property !== ProfileProviderProperties.USERNAME,
            ),
            providerData,
          ],
        });
      }
      return { currentProfile };
    },
    onError: (error: Error, variables, context) => {
      if (pubKey) {
        // rollback the changes
        queryClient.setQueryData<IProfileData>([PROFILE_KEY, pubKey], context.currentProfile);
      }
      logError('use-username.useEnsRegistration.onError', error);
    },
  });
}

const validateUsername = async (username: string) => {
  const sdk = getSDK();
  try {
    const res = await sdk.api.ens.isAvailable(username);
    return res.data;
  } catch (error) {
    logError('useProfile.validateUsername', error);
    throw error;
  }
};

export function useUsernameValidation(username: string) {
  return useQuery([VALIDATE_USERNAME_KEY, username], async () => validateUsername(username), {
    enabled: !!username,
  });
}

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
