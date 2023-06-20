import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getSDK from '@akashaorg/awf-sdk';

import { CurrentUser, EthProviders } from '@akashaorg/typings/sdk';

import { useGlobalLogin } from '.';
import { logError } from './utils/error-handler';

const LOGIN_STATE_KEY = 'LOGIN_STATE';
const CHECK_SIGNUP_KEY = 'CHECK_SIGNUP_KEY';
const CURRENT_USER_KEY = 'CURRENT_USER_KEY';

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

export function useCurrentUser() {
  return useQuery([CURRENT_USER_KEY], () => getSDK().api.auth.getCurrentUser());
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
        isSigningIn: true,
      }));
    },
    onLogout: () => {
      queryClient.setQueryData([LOGIN_STATE_KEY], { ethAddress: null, pubKey: null });
    },
    onLoadFromCache: data => {
      queryClient.setQueryData<LoginState>([LOGIN_STATE_KEY], prev => ({
        ...prev,
        ...data,
        fromCache: true,
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
        return currentData || initialData;
      }),
    {
      initialData: initialData,
    },
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

/**
 * Hook to check if a user is already registered
 * @example useCheckSignup hook
 * ```typescript
 * const checkSignupQuery = useCheckSignup('0x42b35jk53ifq');
 * // checkSignupQuery.data returns a boolean value which determines if one should proceed with signup process or not
 * ```
 */
export function useCheckSignup(ethAddress: string) {
  const sdk = getSDK();
  return useQuery(
    [CHECK_SIGNUP_KEY],
    async () => {
      try {
        return await sdk.api.auth.checkIfSignedUp(ethAddress);
      } catch (err) {
        return false;
      }
    },
    {
      enabled: !!ethAddress,
      refetchOnWindowFocus: true,
      retry: false,
      onError: (err: Error) => logError('useCheckSignup', err),
    },
  );
}
