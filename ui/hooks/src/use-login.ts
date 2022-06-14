import * as React from 'react';
import { filter, lastValueFrom } from 'rxjs';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import getSDK from '@akashaorg/awf-sdk';
import { events } from '@akashaorg/sdk-typings';
import { UseAnalyticsActions } from './use-analytics';
import { WalletTransactionError } from '@akashaorg/ui-awf-typings';
import { AnalyticsCategories } from '@akashaorg/ui-awf-typings/lib/analytics';
import { EthProviders } from '@akashaorg/sdk-typings/lib/interfaces';
import { CurrentUser, PROVIDER_ERROR_CODES } from '@akashaorg/sdk-typings/lib/interfaces/common';

import { useGlobalLogin } from '.';
import { logError } from './utils/error-handler';

const LOGIN_STATE_KEY = 'LOGIN_STATE';
const CHECK_SIGNUP_KEY = 'CHECK_SIGNUP_KEY';

const SIGNUP_STATES = {
  [events.AUTH_EVENTS.CONNECT_ADDRESS]: 0,
  [events.AUTH_EVENTS.CONNECT_ADDRESS_SUCCESS]: 1,
  [events.AUTH_EVENTS.SIGN_AUTH_MESSAGE]: 3,
  [events.AUTH_EVENTS.SIGN_AUTH_MESSAGE_SUCCESS]: 4,
  [events.AUTH_EVENTS.SIGN_COMPOSED_MESSAGE]: 5,
  [events.AUTH_EVENTS.SIGN_COMPOSED_MESSAGE_SUCCESS]: 6,
  [events.AUTH_EVENTS.SIGN_TOKEN_MESSAGE]: 7,
  [events.AUTH_EVENTS.READY]: 8,
};
type ErrorTypes = { code?: number; message?: string; extensions?: { code?: string } };

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

interface SignUpPayload {
  data: { code?: number; address?: string };
  event: string;
}

const initialData = {
  ethAddress: null,
  pubKey: null,
  isReady: false,
  waitForAuth: false,
  isSigningIn: false,
};

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
      checkRegistered = true,
    }: {
      selectedProvider: EthProviders;
      checkRegistered: boolean;
    }) => {
      const resp = await lastValueFrom(
        sdk.api.auth.signIn({
          provider: selectedProvider,
          checkRegistered,
        }),
      );
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
 * Hook to sign up a user
 * @example useSignUp hook
 * ```typescript
 * const { signUpState, ethAddress, fireRemainingMessages, error, fullSignUp, resetState } = useSignUp('selected provider', true);
 * ```
 */
export function useSignUp(
  provider: EthProviders,
  checkRegistered = false,
  analyticsActions?: UseAnalyticsActions,
) {
  const sdk = getSDK();
  const globalChannel = React.useRef(sdk.api.globalChannel);
  const [signUpState, setSignUpState] = React.useState(
    SIGNUP_STATES[events.AUTH_EVENTS.CONNECT_ADDRESS_SUCCESS],
  );
  const [ethAddress, setEthAddress] = React.useState<string>('');
  const [error, setError] = React.useState<ErrorTypes>(null);

  const onError = (error: WalletTransactionError) => {
    setError(error);
  };

  React.useEffect(() => {
    const waitForAuth = globalChannel.current.pipe(
      filter(payload => payload.event in SIGNUP_STATES),
    );

    const sub = waitForAuth.subscribe((payload: SignUpPayload) => {
      setError(null);
      setSignUpState(SIGNUP_STATES[payload.event]);
      if (payload.event === events.AUTH_EVENTS.CONNECT_ADDRESS_SUCCESS) {
        setEthAddress(payload.data.address);
      }
    });
    return () => sub.unsubscribe();
  }, []);

  const fullSignUp = useMutation(
    async () =>
      lastValueFrom(
        sdk.api.auth.signIn({
          provider,
          checkRegistered: checkRegistered,
          resumeSignIn: false,
        }),
      ),
    {
      onError,
    },
  );

  const connectWallet = useMutation(
    async () => lastValueFrom(sdk.api.auth.connectAddress(provider)),
    {
      onError: (err: WalletTransactionError) => {
        if (err.code === PROVIDER_ERROR_CODES.UserRejected) {
          analyticsActions?.trackEvent({
            category: AnalyticsCategories.SIGN_UP_WALLET,
            action: 'Step 4-1 Aborted',
          });
        }
        onError(err);
      },
      onSuccess: () => {
        analyticsActions?.trackEvent({
          category: AnalyticsCategories.SIGN_UP_WALLET,
          action: 'Step 4-1 Completed',
        });
      },
    },
  );

  const signAuthMessage = useMutation(async () => lastValueFrom(sdk.api.auth.signAuthMessage()), {
    onError: (err: WalletTransactionError) => {
      if (err.code === PROVIDER_ERROR_CODES.UserRejected) {
        analyticsActions?.trackEvent({
          category: AnalyticsCategories.SIGN_UP_WALLET,
          action: 'Step 4-2 Declined',
        });
      }
      onError(err);
    },
    onSuccess: () => {
      analyticsActions?.trackEvent({
        category: AnalyticsCategories.SIGN_UP_WALLET,
        action: 'Step 4-2 Completed',
      });
    },
  });

  const signComposedMessage = useMutation(
    async () => lastValueFrom(sdk.api.auth.signComposedMessage()),
    {
      onError: (err: WalletTransactionError) => {
        if (err.code === PROVIDER_ERROR_CODES.UserRejected) {
          analyticsActions?.trackEvent({
            category: AnalyticsCategories.SIGN_UP_WALLET,
            action: 'Step 4-3 Declined',
          });
        }
        onError(err);
      },
      onSuccess: () => {
        analyticsActions?.trackEvent({
          category: AnalyticsCategories.SIGN_UP_WALLET,
          action: 'Step 4-3 Completed',
        });
      },
    },
  );

  const finishSignUp = useMutation(
    async () => {
      await lastValueFrom(sdk.api.auth.signTokenMessage());
      return lastValueFrom(
        sdk.api.auth.signIn({
          provider,
          checkRegistered: false,
          resumeSignIn: true,
        }),
      );
    },
    {
      onError: (err: WalletTransactionError) => {
        if (err.code === PROVIDER_ERROR_CODES.UserRejected) {
          analyticsActions?.trackEvent({
            category: AnalyticsCategories.SIGN_UP_WALLET,
            action: 'Step 4-4 Declined',
          });
        }
        onError(err);
      },
      onSuccess: () => {
        analyticsActions?.trackEvent({
          category: AnalyticsCategories.SIGN_UP_WALLET,
          action: 'Step 4-4 Completed',
        });
      },
    },
  );

  const fireRemainingMessages = React.useCallback(async () => {
    const fullSeries = [connectWallet, signAuthMessage, signComposedMessage, finishSignUp];
    const excludeIndexes = Math.floor(signUpState / 2);
    const seriesToExecute = fullSeries.slice(excludeIndexes);
    for (const request of seriesToExecute) {
      await request.mutateAsync();
    }
  }, [signUpState, connectWallet, signAuthMessage, signComposedMessage, finishSignUp]);

  const resetState = () => {
    setSignUpState(SIGNUP_STATES[events.AUTH_EVENTS.CONNECT_ADDRESS_SUCCESS]);
    setError(null);
    setEthAddress('');
  };

  return {
    connectWallet,
    ethAddress,
    fullSignUp,
    signUpState,
    error,
    fireRemainingMessages,
    resetState,
  };
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
    CHECK_SIGNUP_KEY,
    async () => {
      try {
        const resp = await lastValueFrom(sdk.api.auth.checkIfSignedUp(ethAddress));
        return resp.data && resp.data.hasOwnProperty('getProfile');
      } catch (err) {
        return false;
      }
    },
    {
      enabled: !!ethAddress,
      refetchOnWindowFocus: false,
      retry: false,
      onError: (err: Error) => logError('useCheckSignup', err),
    },
  );
}
