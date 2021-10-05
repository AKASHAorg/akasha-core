import getSDK from '@akashaproject/awf-sdk';
import { EthProviders } from '@akashaproject/sdk-typings/lib/interfaces';
import { CurrentUser } from '@akashaproject/sdk-typings/lib/interfaces/common';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import { useGlobalLogin } from '.';
import { createErrorHandler, logError } from './utils/error-handler';
import { IAkashaError } from '@akashaproject/ui-awf-typings';

const LOGIN_STATE_KEY = 'LOGIN_STATE';

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

export interface UseGetLoginProps {
  /* error handler */
  onError?: (err: IAkashaError) => void;
}

export function useGetLogin(props?: UseGetLoginProps) {
  const { onError } = props || {};
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
      if (onError) createErrorHandler('useGetLogin.globalLogin', false, onError)(payload.error);
    },
  });
  return useQuery(
    [LOGIN_STATE_KEY],
    () =>
      new Promise<LoginState>(() => {
        /* empty fn */
      }),
    {
      initialData: {
        ethAddress: null,
        pubKey: null,
        isReady: false,
        waitForAuth: false,
        isSigningIn: false,
      },
    },
  );
}

export function useLogin(onError?: (err: IAkashaError) => void) {
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
        throw error;
      }
    },
    {
      onError: (payload: Error) => {
        if (onError) createErrorHandler('useLogin', false, onError)(payload);
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
