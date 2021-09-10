import getSDK from '@akashaproject/awf-sdk';
import { EthProviders } from '@akashaproject/sdk-typings/lib/interfaces';
import { CurrentUser } from '@akashaproject/sdk-typings/lib/interfaces/common';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import { useGlobalLogin } from '.';
import { logError } from './utils/error-handler';

const LOGIN_STATE_KEY = 'LOGIN_STATE';

interface LoginState extends CurrentUser {
  isReady?: boolean;
  signInReceived: boolean;
  // boolean to indicate if the user was previously logged in
  // data from cache!
  // if this is true, we can assume that the user is logged in
  // otherwise, we can assume that the user is not logged in
  fromCache?: boolean;
}

export function useGetLogin() {
  const queryClient = useQueryClient();

  useGlobalLogin({
    onLogin: data => {
      queryClient.setQueryData([LOGIN_STATE_KEY], { ...data, signInReceived: true });
    },
    onLogout: () => {
      queryClient.setQueryData([LOGIN_STATE_KEY], { ethAddress: null, pubKey: null });
    },
    onReady: data => {
      queryClient.setQueryData<LoginState>([LOGIN_STATE_KEY], prev => ({
        ...prev,
        ethAddress: data.ethAddress,
        pubKey: data.pubKey,
        isReady: true,
      }));
    },
    onLoadFromCache: data => {
      queryClient.setQueryData<LoginState>([LOGIN_STATE_KEY], prev => ({
        ...prev,
        ...data,
        fromCache: true,
      }));
    },
  });
  return useQuery(
    [LOGIN_STATE_KEY],
    () =>
      new Promise<LoginState>(() => {
        /* empty fn */
      }),
    {
      initialData: { ethAddress: null, pubKey: null, isReady: false, signInReceived: false },
    },
  );
}

export function useLogin() {
  const queryClient = useQueryClient();
  const sdk = getSDK();
  return useMutation(
    async ({
      selectedProvider,
      checkRegistered = true,
    }: {
      selectedProvider: EthProviders;
      checkRegistered: boolean;
    }) => {
      try {
        const resp = await lastValueFrom(
          sdk.api.auth.signIn({
            provider: selectedProvider,
            checkRegistered,
          }),
        );
        if (resp.data) {
          queryClient.setQueryData([LOGIN_STATE_KEY], resp.data);
        }
        return resp.data;
      } catch (error) {
        logError('use-login', error);
        throw error;
      }
    },
  );
}
export function useLogout() {
  const queryClient = useQueryClient();
  const sdk = getSDK();
  return useMutation(async () => {
    try {
      const resp = await lastValueFrom(sdk.api.auth.signOut());
      if (resp.data) {
        queryClient.setQueryData([LOGIN_STATE_KEY], {
          ethAddress: null,
          pubKey: null,
          isReady: false,
          filAddress: null,
          isNewUser: false,
        });
        return resp.data;
      }
    } catch (error) {
      logError('use-logout', error);
      throw error;
    }
  });
}
