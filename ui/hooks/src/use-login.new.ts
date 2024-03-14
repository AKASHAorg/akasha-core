import React, { useCallback, useEffect, useState } from 'react';
import { CurrentUser, EthProviders } from '@akashaorg/typings/lib/sdk';
import { useGlobalLogin } from './use-global-login';
import { useTheme } from './use-theme';
import { logError } from './utils/error-handler';
import { useGetProfileByDidLazyQuery } from './generated/apollo';
import { hasOwn } from './utils/has-own';
import getSDK from '@akashaorg/awf-sdk';
import { useRootComponentProps } from './use-root-props';

export function useConnectWallet() {
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

  const [data, setData] = useState<string | null>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(() => {
    setIsLoading(true);
    const connectWalletApiCall = async () => {
      try {
        const resp = await sdk.api.auth.connectAddress();
        if (resp) {
          setData(resp);
          setIsLoading(false);
        }
      } catch (err) {
        logError('useConnectWallet', err);
        setError(err);
        setData(null);
      }
    };

    connectWalletApiCall();
  }, []);

  return { connect, data, isLoading, error, isSuccess: !!data, isError: !!error };
}

/**
 * Hook for retrieving the current authentication state of the user
 * @example useGetLogin hook
 * ```typescript
 * const loginQuery = useGetLogin();
 * // can be used with useGetProfile hook to get the logged profile data
 * const profileDataQuery = useGetProfile(loginQuery.data?.id);
 *
 const authenticatedProfile = profileDataQuery.data;
 * ```
 */
export function useGetLogin(onError?: (error: Error) => void) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginData, setLoginData] = useState<CurrentUser>(null);

  // check previous session
  useEffect(() => {
    const getCurrentUser = async () => {
      const sdk = getSDK();
      try {
        const data = await sdk.api.auth.getCurrentUser();
        setLoginData(data);
      } catch (err) {
        logError('getCurrentUser', err);
        setError(err);
      } finally {
        setLoading(false);
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
      setError(payload.error);
    },
  });

  return { data: loginData, loading, error };
}

/**
 * Hook that automatically fetches the profile data of the logged in user
 * when it logs in
 */
export const useGetLoginProfile = () => {
  const { data } = useGetLogin();
  const { logger } = useRootComponentProps();
  const [fetchProfile, profileQuery] = useGetProfileByDidLazyQuery();

  React.useEffect(() => {
    if (!data || !data.id) return;
    fetchProfile({
      variables: {
        id: data.id,
      },
    }).catch(err => logger.error('useGetLoginProfile hook', err));
  }, [logger, data, fetchProfile]);

  return React.useMemo(() => {
    if (profileQuery.data?.node && hasOwn(profileQuery.data.node, 'akashaProfile')) {
      return profileQuery.data.node;
    }
    return undefined;
  }, [profileQuery]);
};

/**
 * Hook to sign in a user
 */
export function useLogin(onError?: (err: Error) => void) {
  const sdk = getSDK();

  const [data, setData] = useState<
    | ({
        id?: string;
        ethAddress?: string;
      } & {
        isNewUser: boolean;
      })
    | null
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const signIn = useCallback(
    ({
      selectedProvider,
      checkRegistered = false,
    }: {
      selectedProvider: EthProviders;
      checkRegistered?: boolean; // optional, use if we need to check registered status
    }) => {
      setIsLoading(true);
      const signInApiCall = async () => {
        try {
          const resp = await sdk.api.auth.signIn({
            provider: selectedProvider,
            checkRegistered,
          });
          if (resp.data) {
            setData(resp.data);
            setIsLoading(false);
          }
        } catch (err) {
          logError('use-login', err);
          setError(err);
          setData(null);
          if (onError) {
            onError(err);
          }
        }
      };

      signInApiCall();
    },
    [],
  );

  return { signIn, data, isLoading, signInErrors: error, isSuccess: !!data, isError: !!error };
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
  const [data, setData] = useState<unknown>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const sdk = getSDK();

  const logOut = useCallback(() => {
    setIsLoading(true);
    const logoutApiCall = async () => {
      try {
        const resp = await sdk.api.auth.signOut();
        if (resp.data) {
          setData(resp);
          setIsLoading(false);
        }
      } catch (err) {
        logError('use-logout', err);
        setError(err);
      }
    };

    logoutApiCall();
  }, []);

  return { logOut, data, isLoading, logOutErrors: error };
}
