import getSDK from '@akashaproject/awf-sdk';
import { EthProviders } from '@akashaproject/sdk-typings/lib/interfaces';
import { CurrentUser } from '@akashaproject/sdk-typings/lib/interfaces/common';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import { useGlobalLogin } from './';
import { logError } from './utils/error-handler';

const LOGIN_STATE_KEY = 'LOGIN_STATE';
const CHECK_SIGNUP_KEY = 'CHECK_SIGNUP_KEY';

export interface LoginState extends CurrentUser {
  isReady?: boolean;
  waitForAuth?: boolean;
  isSigningIn?: boolean;
  // boolean to indicate if the user was previously logged in
  // data from cache!
  // if this is true, we can assume that the user is logged in
  // otherwise, we can assume that the user is not logged in
  fromCache?: boolean;
}

const initialData = {
  ethAddress: null,
  pubKey: null,
  isReady: false,
  waitForAuth: false,
  isSigningIn: false,
};

export function useGetLogin(onError?: (error: Error) => void) {
  const queryClient = useQueryClient();

  useGlobalLogin({
    onLogin: data => {
      queryClient.setQueryData<LoginState>([LOGIN_STATE_KEY], prev => ({
        ...prev,
        ...data,
        isSigningIn: true,
      }));
    },
    onLogout: () => {
      queryClient.setQueryData([LOGIN_STATE_KEY], { ethAddress: null, pubKey: null });
    },
    waitForAuth: data => {
      queryClient.setQueryData<LoginState>([LOGIN_STATE_KEY], prev => ({
        ...prev,
        waitForAuth: data,
      }));
    },
    onReady: data => {
      queryClient.setQueryData<LoginState>([LOGIN_STATE_KEY], prev => ({
        ...prev,
        ethAddress: data.ethAddress,
        pubKey: data.pubKey,
        waitForAuth: false,
        isReady: true,
        isSigningIn: false,
      }));
    },
    onLoadFromCache: data => {
      queryClient.setQueryData<LoginState>([LOGIN_STATE_KEY], prev => ({
        ...prev,
        ...data,
        fromCache: true,
      }));
    },
    onError: payload => {
      console.log('onError', payload);
      if (onError) {
        onError(payload.error);
      }
      logError('useGetLogin', payload.error);
    },
  });

  return useQuery(
    [LOGIN_STATE_KEY],
    () =>
      new Promise<LoginState>(() => {
        const currentData = queryClient.getQueryData<LoginState>([LOGIN_STATE_KEY]);
        return currentData || initialData;
      }),
    {
      initialData: initialData,
    },
  );
}

export function useLogin(onError?: (err: Error) => void) {
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
        return resp.data;
      } catch (error) {
        logError('use-login', error);
        if (onError) {
          onError(error);
        }
        throw error;
      }
    },
    {
      onError: (payload: Error) => {
        logError('use-login', payload);
      },
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

// hook to check if an ethAddress is already registered
export function useCheckSignup(ethAddress) {
  const sdk = getSDK();
  return useQuery(
    CHECK_SIGNUP_KEY,
    async () => {
      try {
        const resp = await lastValueFrom(sdk.api.auth.checkIfSignedUp(ethAddress));
        return resp.data;
      } catch (error) {
        logError('useCheckSignup', error);
        throw error;
      }
    },
    {
      enabled: !!ethAddress,
    },
  );
}
