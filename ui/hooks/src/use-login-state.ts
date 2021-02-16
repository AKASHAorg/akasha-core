/**
 * Hook used for logged in user
 */
import * as React from 'react';
import useGlobalLogin from './use-global-login';
import { IAkashaError, EthProviders } from '@akashaproject/ui-awf-typings';
import { filter, takeLast } from 'rxjs/operators';
import { race } from 'rxjs';
import { createErrorHandler } from './utils/error-handler';

export interface UseLoginProps {
  /* sdk global events observable */
  globalChannel: any;
  /* error handler */
  onError?: (err: IAkashaError) => void;
  // handler called when the user is logging out
  onLogout?: () => void;
  /* sdk authentication module */
  authService: any;
  profileService: any;
  ipfsService: any;
}
export interface UseLoginState {
  /* logged in user's ethAddress */
  ethAddress: string | null;
  pubKey: string | null;
}
export interface UseLoginActions {
  /* Login */
  login: (provider: EthProviders) => void;
  /* Logout */
  logout: () => void;
  /* call this before showing the profile form */
  resetUpdateStatus: () => void;
}

const useLoginState = (props: UseLoginProps): [UseLoginState, UseLoginActions] => {
  const { globalChannel, onError, authService } = props;
  const [loginState, setLoginState] = React.useState<UseLoginState>({
    ethAddress: null,
    pubKey: null,
  });
  // this will also reset profile data
  useGlobalLogin({
    globalChannel,
    onLogin: payload =>
      setLoginState({
        ethAddress: payload.ethAddress,
        pubKey: payload.pubKey,
      }),
    onLogout: () => {
      if (props.onLogout) {
        props.onLogout();
      }
      setLoginState({
        ethAddress: null,
        pubKey: null,
      });
    },
    onError: payload => {
      createErrorHandler('useLoginState.globalLogin', false, onError)(payload.error);
    },
  });

  React.useEffect(() => {
    // make an attempt to load the eth address from cache;
    if (authService) {
      const getDeps = authService.getCurrentUser(null);
      getDeps.subscribe((resp: { data: any }) => {
        const { data } = resp;
        if (data?.ethAddress && data?.pubKey) {
          setLoginState(prev => ({
            ...prev,
            ethAddress: data.ethAddress,
            pubKey: data.pubKey,
          }));
        }
      }, createErrorHandler('useLoginState.authService', false, onError));
    }
  }, []);

  const actions: UseLoginActions = {
    login(selectedProvider: EthProviders) {
      try {
        const call = authService.signIn(selectedProvider);
        // handle the case where signIn was triggered from another place
        const globalCall = globalChannel.pipe(
          filter((response: any) => response.channelInfo.method === 'signIn'),
          takeLast(1),
        );
        race(call, globalCall).subscribe((response: any) => {
          const { pubKey, ethAddress } = response.data;
          setLoginState(prev => ({
            ...prev,
            pubKey,
            ethAddress,
          }));
        }, createErrorHandler('useLoginState.login.subscription', false, onError));
      } catch (ex) {
        createErrorHandler('useLoginState.login', false, onError)(ex);
      }
    },
    logout() {
      const call = authService.signOut(null);
      call.subscribe(
        (resp: any) => {
          if (resp.data) {
            setLoginState(prev => ({
              ...prev,
              ethAddress: null,
              token: null,
            }));
          }
        },
        (err: Error) => {
          createErrorHandler('useLoginState.logout', false, onError)(err);
          setLoginState(prev => ({
            ...prev,
            ethAddress: null,
            pubKey: null,
          }));
        },
      );
    },
    resetUpdateStatus() {
      setLoginState(prev => ({
        ...prev,
        updateStatus: {
          updateComplete: false,
          saving: false,
          uploadingAvatar: false,
          uploadingCoverImage: false,
        },
      }));
    },
  };
  return [loginState, actions];
};

export default useLoginState;
