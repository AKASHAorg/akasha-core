import { useMutation, useQuery } from 'react-query';
import getSDK from '@akashaproject/awf-sdk';
import { ProfileProviders } from '@akashaproject/ui-awf-typings/lib/profile';
import { logError } from './utils/error-handler';

export const UPDATE_USERNAME_PROVIDER_KEY = 'UPDATE_USERNAME_PROVIDER';
export const REGISTER_ENS_KEY = 'REGISTER_ENS';

export const VALIDATE_USERNAME_KEY = 'VALIDATE_USERNAME_KEY';

const updateUsernameProvider = async ({
  userName,
  provider,
}: {
  userName: string;
  provider: ProfileProviders;
}) => {
  const sdk = getSDK();
  return Promise.resolve({ userName, provider });
};
export function useUsernameProviderUpdate() {
  return useMutation(updateUsernameProvider, {
    onMutate: () => {
      /* todo */
    },
    onSuccess: () => {
      /* todo */
    },
    onError: () => {
      /* todo */
    },
    mutationKey: UPDATE_USERNAME_PROVIDER_KEY,
  });
}

const registerENS = async ({ userName }: { userName: string }) => {
  const sdk = getSDK();
  return Promise.resolve(userName);
};

export function useEnsRegistration() {
  return useMutation(registerENS, {
    onMutate: ({ userName }: { userName: string }) => {
      /* todo */
    },
    onSuccess: () => {
      /* todo */
    },
    onError: () => {
      /* todo */
    },
    mutationKey: REGISTER_ENS_KEY,
  });
}

const validateUsername = async (username: string) => {
  const sdk = getSDK();
  try {
    const res = await sdk.api.ens.isAvailable(username);
    return res;
  } catch (error) {
    logError('useProfile.validateUsername', error);
  }
};

export function useUsernameValidation(username: string) {
  return useQuery([VALIDATE_USERNAME_KEY, username], async () => validateUsername(username), {
    enabled: !!username,
  });
}
