/**
 * Hook used for logged in user
 */
import * as React from 'react';
import useGlobalLogin from './use-global-login';
import { IAkashaError, EthProviders } from '@akashaproject/ui-awf-typings';
import { filter, takeLast } from 'rxjs/operators';
import { forkJoin, race } from 'rxjs';
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
  updateStatus: {
    saving: boolean;
    uploadingAvatar: boolean;
    uploadingCoverImage: boolean;
    updateComplete: boolean;
  };
}
export interface UseLoginActions {
  /* Login */
  login: (provider: EthProviders) => void;
  /* Logout */
  logout: () => void;
  /* When the profile updates, set the new data without querying the server again */
  optimisticUpdate: (data: any) => void;
  /* call this before showing the profile form */
  resetUpdateStatus: () => void;
}

const useLoginState = (
  props: UseLoginProps,
): [
  UseLoginState & { profileData: Partial<IProfileData> },
  UseLoginActions & UseProfileActions,
] => {
  const { globalChannel, onError, authService, ipfsService, profileService, cacheService } = props;
  const [loginState, setLoginState] = React.useState<UseLoginState>({
    ethAddress: null,
    token: null,
    updateStatus: {
      saving: false,
      uploadingAvatar: false,
      uploadingCoverImage: false,
      updateComplete: false,
    },
  });
  const [loggedProfileData, loggedProfileActions] = useProfile({
    ipfsService,
    profileService,
    onError: onError,
  });
  // this will also reset profile data
  useGlobalLogin(
    globalChannel,
    payload =>
      setLoginState(prev => ({
        ...prev,
        ethAddress: payload.ethAddress,
        token: payload.token,
      })),
    payload => {
      if (onError) {
        onError({
          errorKey: 'useLoginState.globalLogin',
          error: payload.error,
          critical: false,
        });
      }
    },
  );

  React.useEffect(() => {
    if (loginState.ethAddress) {
      loggedProfileActions.getProfileData({ ethAddress: loginState.ethAddress });
    }
  }, [loginState.ethAddress]);

  React.useEffect(() => {
    // make an attempt to load the eth address from cache;
    const getDeps = cacheService.getStash(null);
    getDeps.subscribe(
      (resp: { data: any }) => {
        const { data } = resp;
        if (data.entries.has('auth')) {
          const authValue = data.cache.get('auth');
          if (authValue.hasOwnProperty('ethAddress')) {
            setLoginState(prev => ({
              ...prev,
              ethAddress: authValue.ethAddress,
              token: authValue.token,
            }));
          }
        }
      },
      (err: Error) => {
        if (onError) {
          onError({
            errorKey: 'useLoginState.cacheService',
            error: err,
            critical: false,
          });
        }
      },
    );
  }, []);

  const actions: UseLoginActions = {
    optimisticUpdate(data) {
      const { avatar, coverImage, name, description } = data;
      setLoginState(prev => ({
        ...prev,
        updateStatus: {
          ...prev.updateStatus,
          saving: true,
        },
      }));
      const errorHandler = (err: Error) => {
        if (onError) {
          onError({
            errorKey: 'useLoginState.optimisticUpdate',
            error: err,
            critical: true,
          });
        }
      };
      const obs = [];

      if (avatar && avatar.src && avatar.preview !== loggedProfileData.avatar) {
        setLoginState(prev => ({
          ...prev,
          updateStatus: { ...prev.updateStatus, uploadingAvatar: true },
        }));
        obs.push(
          profileService.saveMediaFile({
            isUrl: avatar.isUrl,
            content: avatar.src,
            name: 'avatar',
          }),
        );
      } else {
        obs.push(Promise.resolve());
      }

      if (coverImage && coverImage.src && coverImage.preview !== loggedProfileData.coverImage) {
        setLoginState(prev => ({
          ...prev,
          updateStatus: { ...prev.updateStatus, uploadingCoverImage: true },
        }));
        obs.push(
          profileService.saveMediaFile({
            isUrl: coverImage.isUrl,
            content: coverImage.src,
            name: 'coverImage',
          }),
        );
      } else {
        obs.push(Promise.resolve());
      }

      forkJoin(obs).subscribe((responses: any[]) => {
        const [avatarRes, coverImageRes] = responses;
        setLoginState(prev => ({
          ...prev,
          updateStatus: {
            ...prev.updateStatus,
            uploadingAvatar: false,
            uploadingCoverImage: false,
          },
        }));
        const providers: any[] = [];
        if (avatarRes) {
          providers.push({
            provider: 'ewa.providers.basic',
            property: 'avatar',
            value: avatarRes.data,
          });
        }
        if (coverImageRes) {
          providers.push({
            provider: 'ewa.providers.basic',
            property: 'coverImage',
            value: coverImageRes.data,
          });
        }
        if (description) {
          providers.push({
            provider: 'ewa.providers.basic',
            property: 'description',
            value: description,
          });
        }
        if (name) {
          providers.push({
            provider: 'ewa.providers.basic',
            property: 'name',
            value: name,
          });
        }
        const makeDefault = profileService.makeDefaultProvider(providers);
        makeDefault.subscribe((_res: any) => {
          const updatedFields = providers
            .map(provider => ({ [provider.property]: provider.value }))
            .reduce((acc, curr) => Object.assign(acc, curr), {});
          loggedProfileActions.updateProfile(updatedFields);
          setLoginState(prev => ({
            ...prev,
            updateStatus: {
              ...prev.updateStatus,
              saving: false,
              updateComplete: true,
            },
          }));
        }, errorHandler);
      }, errorHandler);
    },
    login(selectedProvider: EthProviders) {
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
            setLoginState(prev => ({
              ...prev,
              token,
              ethAddress,
            }));
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
      setLoginState(prev => ({
        ...prev,
        ethAddress: null,
        token: null,
      }));
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
  return [
    { ...loginState, profileData: loggedProfileData },
    { ...actions, ...loggedProfileActions },
  ];
};

export default useLoginState;
