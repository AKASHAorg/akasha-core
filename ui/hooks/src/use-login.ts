import * as React from 'react';
import getSDK from '@akashaproject/awf-sdk';
import { events } from '@akashaproject/sdk-typings';
import { EthProviders } from '@akashaproject/sdk-typings/lib/interfaces';
import { CurrentUser } from '@akashaproject/sdk-typings/lib/interfaces/common';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { filter, lastValueFrom } from 'rxjs';
import { useGlobalLogin } from '.';
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
 * @param onError - outside error handler
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
 * @param onError - outside error handler
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

const SIGNUP_STATES = {
  [events.AUTH_EVENTS.CONNECT_ADDRESS]: 1,
  [events.AUTH_EVENTS.CONNECT_ADDRESS_SUCCESS]: 2,
  [events.AUTH_EVENTS.SIGN_AUTH_MESSAGE]: 3,
  [events.AUTH_EVENTS.SIGN_AUTH_MESSAGE_SUCCESS]: 4,
  [events.AUTH_EVENTS.SIGN_COMPOSED_MESSAGE]: 5,
  [events.AUTH_EVENTS.SIGN_COMPOSED_MESSAGE_SUCCESS]: 6,
  [events.AUTH_EVENTS.SIGN_TOKEN_MESSAGE]: 7,
  [events.AUTH_EVENTS.READY]: 8,
};

export function useSignUp(provider: EthProviders) {
  const sdk = getSDK();
  const [signUpState, setSignUpState] = React.useState(1);
  const [ethAddress, setEthAddress] = React.useState('');
  const [errorCode, setErrorCode] = React.useState(null);
  const onError = (e: Error & { code?: number }) => {
    setErrorCode(e.code);
  };

  React.useEffect(() => {
    const waitForAuth = sdk.api.globalChannel.pipe(
      filter(payload => payload.event in SIGNUP_STATES),
    );

    const sub = waitForAuth.subscribe((payload: SignUpPayload) => {
      setErrorCode(null);
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
          checkRegistered: false,
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
      onError,
    },
  );

  const signAuthMessage = useMutation(async () => lastValueFrom(sdk.api.auth.signAuthMessage()), {
    onError,
  });

  const signComposedMessage = useMutation(
    async () => lastValueFrom(sdk.api.auth.signComposedMessage()),
    {
      onError,
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
      onError,
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

  return {
    ethAddress,
    fullSignUp,
    signUpState,
    errorCode,
    fireRemainingMessages,
  };
}

/**
 * Hook to sign out the current user
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
 * @param ethAddress - ethereum address to check for
 */
export function useCheckSignup(ethAddress) {
  const sdk = getSDK();
  return useQuery(
    CHECK_SIGNUP_KEY,
    async () => {
      const resp = await lastValueFrom(sdk.api.auth.checkIfSignedUp(ethAddress));
      return resp.data;
    },
    {
      enabled: !!ethAddress,
      onError: (err: Error) => logError('useCheckSignup', err),
    },
  );
}
