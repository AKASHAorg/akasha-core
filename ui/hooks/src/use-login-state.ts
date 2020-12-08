/**
 * Hook used for logged in user
 */
import * as React from 'react';
import useGlobalLogin from './use-global-login';
import { IAkashaError, EthProviders } from '@akashaproject/ui-awf-typings';
import { filter, takeLast } from 'rxjs/operators';
import { race } from 'rxjs';

export interface UseLoginProps {
  /* sdk global events observable */
  globalChannel: any;
  /* error handler */
  onError?: (err: IAkashaError) => void;
  /* sdk authentication module */
  authService: any;
  cacheService: any;
  profileService: any;
}
export interface UseLoginState {
  /* logged in user's ethAddress */
  ethAddress: string | null;
  token: string | null;
  /* logged in user's profile data */
  profileData: {
    avatar: {} | null;
    name: {} | null;
    description: {} | null;
    coverImage: {} | null;
    userName: {} | null;
    url: {} | null;
    creationDate?: number;
    pubKey?: string;
  };
}
export interface UseLoginActions {
  /* Login */
  login: (provider: EthProviders) => void;
  /* Logout */
  logout: () => void;
  /*  */
  updateProfileField: (field: { provider: string; property: string; value: string }) => void;
}

const initialProfileData = {
  avatar: null,
  name: null,
  description: null,
  coverImage: null,
  userName: null,
  url: null,
}
const useLoginState = (props: UseLoginProps): [UseLoginState, UseLoginActions] => {
  const { globalChannel, onError, authService, profileService, cacheService } = props;
  const [loginState, setLoginState] = React.useState<UseLoginState>({
    ethAddress: null,
    token: null,
    profileData: initialProfileData
  });
  // this will also reset profile data
  useGlobalLogin(
    globalChannel,
    (payload) => setLoginState({
      ethAddress: payload.ethAddress,
      token: payload.token,
      profileData: initialProfileData
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
      const call = profileService.getProfile({ ethAddress: loginState.ethAddress });
      call.subscribe((resp: any) => {
        setLoginState(prevState => ({
          ...prevState,
          profileData: resp.data.data.getProfile
        }));
      });
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
            profileData: initialProfileData
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
              profileData: initialProfileData
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
        profileData: initialProfileData
      });
    },
    updateProfileField(field) {
      const call = profileService.addProfileProvider(field);
      call.subscribe((resp: any) => {
        setLoginState(prevState => {
          const updated = Object.assign({}, prevState.profileData, { [resp.data.property]: resp.data });
          return {
            ...prevState,
            profileData: updated
          }
        });
      });
    }
  };
  return [loginState, actions];
}

export default useLoginState;
