import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getSDK from '@akashaorg/awf-sdk';

import { CurrentUser, EthProviders } from '@akashaorg/typings/sdk';

import { useGlobalLogin } from '.';
import { logError } from './utils/error-handler';

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

export function useConnectWallet(provider: EthProviders) {
  const sdk = getSDK();
  return useMutation(async () => sdk.api.auth.connectAddress(provider));
}

/**
 * Hook for retrieving the current authentication state of the user
 * @example useGetLogin hook
 * ```typescript
 * const loginQuery = useGetLogin();
 * // can be used with useGetProfile hook to get the logged profile data
 * const profileDataQuery = useGetProfile(loginQuery.data?.pubKey);
 *
 const loggedProfileData = profileDataQuery.data;
 * ```
 */
export function useGetLogin(onError?: (error: Error) => void) {
  const queryClient = useQueryClient();

  useGlobalLogin({
    onLogin: data => {
      queryClient.setQueryData<LoginState>([LOGIN_STATE_KEY], prev => ({
        ...prev,
        ...data,
      }));
    },
    onLogout: () => {
      queryClient.setQueryData([LOGIN_STATE_KEY], null);
    },
    onLoadFromCache: data => {
      queryClient.setQueryData<LoginState>([LOGIN_STATE_KEY], prev => ({
        ...prev,
        ...data,
      }));
    },
    onError: payload => {
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
        return currentData;
      }),
  );
}

/**
 * Hook to sign in a user
 */
export function useLogin(onError?: (err: Error) => void) {
  const sdk = getSDK();
  return useMutation(
    async ({
      selectedProvider,
      checkRegistered = false,
    }: {
      selectedProvider: EthProviders;
      checkRegistered?: boolean; // optional, use if we need to check registered status
    }) => {
      const resp = await sdk.api.auth.signIn({
        provider: selectedProvider,
        checkRegistered,
      });
      return resp.data;
    },
    {
      onError: (payload: Error) => {
        logError('use-login', payload);
        if (onError) {
          onError(payload);
        }
      },
    },
  );
}

/**
 * Hook to sign out the current user
 * @example useLogout hook
 * ```typescript
 * const logoutMutation = useLogout();
 *
 * // sample logout handler
 * const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    // add other logic after logout
  };
 * ```
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const sdk = getSDK();
  return useMutation(
    async () => {
      const resp = await sdk.api.auth.signOut();
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
    },
    {
      onError: (err: Error) => logError('use-logout', err),
    },
  );
}
