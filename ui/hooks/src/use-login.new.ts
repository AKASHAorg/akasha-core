import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import getSDK from '@akashaorg/awf-sdk';
import { lastValueFrom } from 'rxjs';
import { CurrentUser, EthProviders } from '@akashaorg/typings/lib/sdk';
import { useGlobalLogin } from './use-global-login';
import { useTheme } from './use-theme';
import { logError } from './utils/error-handler';

export const LOGIN_STATE_KEY = 'LOGIN_STATE';

export function useConnectWallet(provider: EthProviders) {
  const { theme } = useTheme();
  const sdk = getSDK();

  useEffect(() => {
    if (theme === 'Dark-Theme' && sdk.services.common.web3.getCurrentTheme() !== 'dark') {
      sdk.services.common.web3.toggleDarkTheme(true);
      return;
    }
    if (theme === 'Light-Theme' && sdk.services.common.web3.getCurrentTheme() !== 'light') {
      sdk.services.common.web3.toggleDarkTheme();
    }
  }, [sdk.services.common.web3, theme]);

  return useMutation(async () => sdk.api.auth.connectAddress());
}

/**
 * Hook for retrieving the current authentication state of the user
 * @example useGetLogin hook
 * ```typescript
 * const loginQuery = useGetLogin();
 * // can be used with useGetProfile hook to get the logged profile data
 * const profileDataQuery = useGetProfile(loginQuery.data?.id);
 *
 const loggedProfileData = profileDataQuery.data;
 * ```
 */
export function useGetLogin(onError?: (error: Error) => void) {
  const [loginData, setLoginData] = useState<CurrentUser>(null);
  const [isLoading, setIsLoading] = useState(true);

  // check previous session
  useEffect(() => {
    const getCurrentUser = async () => {
      const sdk = getSDK();
      try {
        const data = await sdk.api.auth.getCurrentUser();
        setLoginData(data);
      } catch (err) {
        logError('getCurrentUser', err);
      } finally {
        setIsLoading(false);
      }
    };
    getCurrentUser();
  }, []);

  useGlobalLogin({
    onLogin: data => {
      setLoginData(data);
    },
    onLogout: () => {
      setLoginData(null);
    },
    onError: payload => {
      if (onError) {
        onError(payload.error);
      }
      logError('useGetLogin', payload.error);
    },
  });

  return { data: loginData, isLoading: isLoading };
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
        //await queryClient.resetQueries([LOGIN_STATE_KEY]);
        // queryClient.setQueryData([LOGIN_STATE_KEY], null);
        return resp.data;
      }
    },
    {
      onError: (err: Error) => logError('use-logout', err),
    },
  );
}
