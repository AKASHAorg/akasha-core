/**
 * Hook used for logged in user
 */
import * as React from 'react';
import useGlobalLogin from './use-global-login';
import { IAkashaError, EthProviders } from '@akashaproject/ui-awf-typings';
import getSDK from '@akashaproject/awf-sdk';
import { events } from '@akashaproject/sdk-typings';
import { race } from 'rxjs';
import { filter, takeLast } from 'rxjs/operators';
import { createErrorHandler } from './utils/error-handler';

export interface UseLoginProps {
  /* error handler */
  onError?: (err: IAkashaError) => void;
  // handler called when the user is logging out
  onLogout?: () => void;
}
export interface UseLoginActions {
  /* Login */
  login: (provider: EthProviders, checkRegistered?: boolean) => void;
  /* Logout */
  logout: () => void;
}

export interface ILoginState {
  /* logged in user's ethAddress */
  ethAddress: string | null;
  pubKey: string | null;
  /**
   * check if the user is fully logged in or not
   * check this flag whenever you need to make sure
   * that the user login status is settled
   * defaults to false
   */
  currentUserCalled: boolean;
  ready: { ethAddress: string; pubKey: string } | null;
  waitForAuth: boolean | null;
  // reducer related
  loginQuery: { selectedProvider: EthProviders; checkRegistered: boolean } | null;
  logoutQuery: boolean;
}

const initialLoginState: ILoginState = {
  ethAddress: null,
  pubKey: null,
  currentUserCalled: false,
  ready: null,
  waitForAuth: false,
  loginQuery: null,
  logoutQuery: false,
};

export type ILoginAction =
  | { type: 'LOGIN'; payload: { selectedProvider: EthProviders; checkRegistered: boolean } }
  | { type: 'LOGIN_SUCCESS'; payload: { ethAddress: string; pubKey: string } }
  | { type: 'LOGOUT' }
  | { type: 'LOGOUT_SUCCESS' }
  | { type: 'WAIT_AUTH'; payload: boolean }
  | { type: 'READY'; payload: { ethAddress: string; pubKey: string } | null }
  | { type: 'LOAD_FROM_CACHE'; payload: { ethAddress: string; pubKey: string } };

const loginStateReducer = (state: ILoginState, action: ILoginAction) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, loginQuery: action.payload };
    case 'LOGIN_SUCCESS': {
      const { ethAddress, pubKey } = action.payload;
      return { ...state, loginQuery: null, ethAddress, pubKey };
    }
    case 'LOGOUT':
      return { ...state, logoutQuery: true };
    case 'LOGOUT_SUCCESS': {
      return { ...state, logoutQuery: false, ethAddress: null, pubKey: null };
    }
    case 'WAIT_AUTH':
      return { ...state, waitAuth: action.payload };
    case 'READY':
      return { ...state, ready: action.payload };
    case 'LOAD_FROM_CACHE': {
      if (action.payload?.ethAddress && action.payload?.pubKey) {
        return {
          ...state,
          currentUserCalled: true,
          ethAddress: action.payload.ethAddress,
          pubKey: action.payload.pubKey,
        };
      }
      return { ...state, currentUserCalled: true };
    }

    default:
      throw new Error('[UseLoginStateReducer] action is not defined!');
  }
};

const useLoginState = (props: UseLoginProps): [ILoginState, UseLoginActions] => {
  const { onError } = props;

  const sdk = getSDK();

  const [loginState, dispatch] = React.useReducer(loginStateReducer, initialLoginState);

  // this will also reset profile data
  useGlobalLogin({
    onLogin: payload => dispatch({ type: 'LOGIN_SUCCESS', payload }),
    waitForAuth: data => dispatch({ type: 'WAIT_AUTH', payload: data }),
    onReady: data => dispatch({ type: 'READY', payload: data }),
    onLogout: () => {
      if (props.onLogout) {
        props.onLogout();
      }
      dispatch({ type: 'LOGOUT_SUCCESS' }), dispatch({ type: 'READY', payload: null });
    },
    onError: payload => {
      createErrorHandler('useLoginState.globalLogin', false, onError)(payload.error);
    },
  });

  React.useLayoutEffect(() => {
    // make an attempt to load the eth address from cache;
    (async () => {
      const getDeps = await sdk.api.auth.getCurrentUser();
      if (getDeps) {
        dispatch({ type: 'LOAD_FROM_CACHE', payload: getDeps });
      }
    })();
  }, []);

  React.useEffect(() => {
    if (loginState.loginQuery) {
      const call = sdk.api.auth.signIn({
        provider: loginState.loginQuery.selectedProvider,
        checkRegistered: loginState.loginQuery.checkRegistered,
      });
      // handle the case where signIn was triggered from another place
      const globalCall = sdk.api.globalChannel.pipe(
        filter(response => response.event === events.AUTH_EVENTS.SIGN_IN),
        takeLast(1),
      );
      const callSub = race(call, globalCall).subscribe({
        next: (response: any) => {
          dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
        },
        error: createErrorHandler('useLoginState.login.subscription', false, onError),
      });
      return () => callSub.unsubscribe();
    }
    return;
  }, [loginState.loginQuery]);

  React.useEffect(() => {
    if (loginState.logoutQuery) {
      (async () => {
        const call = await sdk.api.auth.signOut();
        if (call) {
          dispatch({ type: 'LOGOUT_SUCCESS' });
        }
      })();
    }
  }, [loginState.logoutQuery]);

  const actions: UseLoginActions = {
    login(selectedProvider: EthProviders, checkRegistered = true) {
      dispatch({ type: 'LOGIN', payload: { selectedProvider, checkRegistered } });
    },
    logout() {
      dispatch({ type: 'LOGOUT' });
    },
  };
  return [loginState, actions];
};

export default useLoginState;
