/**
 * Hook used for logged in user
 */
import * as React from 'react';
import useGlobalLogin from './use-global-login';
import { IAkashaError, EthProviders } from '@akashaproject/ui-awf-typings';
import { filter, takeLast } from 'rxjs/operators';
import { race } from 'rxjs';
import useProfile, { UseProfileActions } from './use-profile';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';

export interface UseLoginProps {
  /* sdk global events observable */
  globalChannel: any;
  /* error handler */
  onError?: (err: IAkashaError) => void;
  /* sdk authentication module */
  authService: any;
  cacheService: any;
  profileService: any;
  ipfsService: any;
}
export interface UseLoginState {
  /* logged in user's ethAddress */
  ethAddress: string | null;
  token: string | null;
}
export interface UseLoginActions {
  /* Login */
  login: (provider: EthProviders) => void;
  /* Logout */
  logout: () => void;
}

const useLoginState = (props: UseLoginProps): [UseLoginState & { profileData: Partial<IProfileData> }, UseLoginActions & UseProfileActions] => {
  const { globalChannel, onError, authService, ipfsService, profileService, cacheService } = props;
  const [loginState, setLoginState] = React.useState<UseLoginState>({
    ethAddress: null,
    token: null,
  });
  const [loggedProfileData, loggedProfileActions] = useProfile({
    ipfsService,
    profileService,
    onError: onError,
  })
  // this will also reset profile data
  useGlobalLogin(
    globalChannel,
    (payload) => setLoginState({
      ethAddress: payload.ethAddress,
      token: payload.token,
    }),
    (payload) => {
      if (onError) {
        onError({
          errorKey: 'useLoginState.globalLogin',
          error: payload.error,
          critical: false
        });
      }
    }
  );

  React.useEffect(() => {
    if (loginState.ethAddress) {
      loggedProfileActions.getProfileData({ ethAddress: loginState.ethAddress });
    }
  }, [loginState.ethAddress]);

  React.useEffect(() => {
    // make an attempt to load the eth address from cache;
    const getDeps = cacheService.getStash(null);
    getDeps.subscribe((resp: { data: any }) => {
      const { data } = resp;
      if (data.entries.has('auth')) {
        const authValue = data.cache.get('auth');
        if (authValue.hasOwnProperty('ethAddress')) {
          setLoginState({
            ethAddress: authValue.ethAddress,
            token: authValue.token,
          });
        }
      }
    }, (err: Error) => {
      if (onError) {
        onError({
          errorKey: 'useLoginState.cacheService',
          error: err,
          critical: false,
        })
      }
    });
  }, []);

  const actions: UseLoginActions = {
    async login(selectedProvider: EthProviders) {
      try {
        const call = authService.signIn(selectedProvider);
        // handle the case where signIn was triggered from another place
        const globalCall = globalChannel.pipe(
          filter((response: any) => response.channelInfo.method === 'signIn'),
          takeLast(1),
        );
        race(call, globalCall).subscribe(
          (response: any) => {
            const { token, ethAddress } = response.data;
            setLoginState({
              token,
              ethAddress,
            });
          },
          (err: Error) => {
            if (onError) {
              onError({
                errorKey: 'useLoginState[subscription].login',
                error: err,
                critical: false,
              });
            }
          },
        );
      } catch (ex) {
        if (onError) {
          onError({
            errorKey: 'useLoginState.login',
            error: ex,
            critical: false,
          });
        }
      }
    },
    logout() {
      setLoginState({
        ethAddress: null,
        token: null,
      });
    },

  };
  return [{ ...loginState, profileData: loggedProfileData }, { ...actions, ...loggedProfileActions }];
}

export default useLoginState;
