import * as React from 'react';
import { concat, forkJoin } from 'rxjs';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import {
  IProfileData,
  IProfileProvider,
  ProfileProviderProperties,
  ProfileProviders,
  UsernameTypes,
} from '@akashaproject/ui-awf-typings/lib/profile';
import { createErrorHandler } from './utils/error-handler';
import { getMediaUrl } from './utils/media-utils';

type voidFunc<T = object> = (arg: T) => void;

export interface UseProfileActions {
  getProfileData: voidFunc<{ pubKey?: string | null; ethAddress?: string | null }>;
  getEntryAuthor: voidFunc<{ entryId: string }>;
  resetProfileData: () => void;
  optimisticUpdate: (data: any) => void;
  updateProfile: (fields: any) => void;
  resetUpdateStatus: () => void;
  validateUsername: ({ userName }: { userName: string }) => void;
  /**
   * get available username provider types
   * return UsernameTypes[]
   */
  getUsernameTypes: () => { default?: IProfileProvider; available: UsernameTypes[] };
  /**
   * Add/Change the username's default provider
   * used for ens domains and to 'unset'
   * a username by providing an empty value.
   * This method does not interact with ens in any way.
   */
  updateUsernameProvider: (payload: { userName: string; provider: ProfileProviders }) => void;
}

export interface UseProfileProps {
  onError?: (error: IAkashaError) => void;
  ipfsService: any;
  profileService: any;
  postsService?: any;
  ensService?: any;
}

export interface ProfileUpdateStatus {
  saving: boolean;
  uploadingAvatar: boolean;
  uploadingCoverImage: boolean;
  updateComplete: boolean;
  isValidating: boolean;
  isValidUsername: boolean | null;
  /* additional context for isValidUsername flag */
  /* when true, it means the regex failed: username contains invalid characters */
  notAllowed: boolean;
}

/* A hook to be used on profile-page */
export const useProfile = (
  props: UseProfileProps,
): [Partial<IProfileData & { isLoading: boolean }>, UseProfileActions, ProfileUpdateStatus] => {
  const { onError, ipfsService, profileService, postsService } = props;
  const [profile, setProfile] = React.useState<Partial<IProfileData & { isLoading: boolean }>>({
    isLoading: true,
  });
  const [updateStatus, setUpdateStatus] = React.useState<ProfileUpdateStatus>({
    saving: false,
    uploadingAvatar: false,
    uploadingCoverImage: false,
    updateComplete: false,
    isValidUsername: null,
    isValidating: false,
    notAllowed: false,
  });

  const actions: UseProfileActions = {
    getProfileData(payload) {
      try {
        setProfile({ isLoading: true });
        const ipfsGatewayCall = ipfsService.getSettings({});
        const getProfileCall = profileService.getProfile(payload);
        const obs = forkJoin([ipfsGatewayCall, getProfileCall]);
        obs.subscribe((resp: any) => {
          if (!resp.length) {
            return;
          }
          const [gatewayResp, profileResp] = resp;
          if (!profileResp.data) {
            return;
          }

          const { avatar, coverImage, ...other } =
            profileResp.data.getProfile || profileResp.data.resolveProfile;
          const images: { avatar?: string; coverImage?: string } = {};
          if (avatar) {
            images.avatar = getMediaUrl(gatewayResp.data, avatar);
          }
          if (coverImage) {
            images.coverImage = getMediaUrl(gatewayResp.data, coverImage);
          }
          setProfile({ ...images, ...other, isLoading: false });
        }, createErrorHandler('useProfile.getProfileData.subscription', false, onError));
      } catch (err) {
        createErrorHandler('useProfile.getProfileData', false, onError)(err);
      }
    },
    validateUsername({ userName }) {
      if (props.ensService) {
        setUpdateStatus(prev => ({ ...prev, isValidating: true }));
        if (/^([a-z0-9\.](?![0-9\.]$))+$/g.test(userName)) {
          const channel = props.ensService.isAvailable({ name: userName });
          channel.subscribe((resp: any) => {
            setUpdateStatus(prev => ({
              ...prev,
              isValidating: false,
              notAllowed: false,
              isValidUsername: resp.data,
            }));
          }, createErrorHandler('useProfile.validateUsername', false, props.onError));
        } else {
          setUpdateStatus(prev => ({
            ...prev,
            isValidating: false,
            isValidUsername: false,
            notAllowed: true,
          }));
        }
      }
    },
    getEntryAuthor({ entryId }) {
      if (!postsService) {
        // tslint:disable-next-line: no-console
        return console.error(
          'Please pass postsService module if you want to use getEntryAuthor method!',
        );
      }
      const getEntryCall = postsService.entries.getEntry({ entryId });
      const ipfsGatewayCall = ipfsService.getSettings({});
      forkJoin([getEntryCall, ipfsGatewayCall]).subscribe((responses: any) => {
        const [entryResp, ipfsResp] = responses;
        if (!entryResp.data) {
          return;
        }
        const { getPost: entry } = entryResp.data;
        if (entry && entry.author) {
          setProfile({
            ...entry.author,
            avatar: getMediaUrl(ipfsResp.data, entry.author.avatar),
            coverImage: getMediaUrl(ipfsResp.data, entry.author.coverImage),
          });
        }
      }, createErrorHandler('useProfile.getEntryAuthor', false, onError));
    },
    updateProfile(fields) {
      setProfile(prev => ({
        ...prev,
        ...fields,
      }));
    },
    optimisticUpdate(data) {
      const { avatar, coverImage, name, description, userName } = data;
      setUpdateStatus(prev => ({
        ...prev,
        saving: true,
      }));

      const obs = [];
      if (avatar && avatar.src && avatar.preview !== profile.avatar) {
        setProfile(prev => ({
          ...prev,
          uploadingAvatar: true,
        }));
        obs.push(
          profileService.saveMediaFile({
            isUrl: avatar.isUrl,
            content: avatar.src,
            name: ProfileProviderProperties.AVATAR,
          }),
        );
      } else {
        obs.push(Promise.resolve(null));
      }

      if (coverImage && coverImage.src && coverImage.preview !== profile.coverImage) {
        setUpdateStatus(prev => ({
          ...prev,
          uploadingCoverImage: true,
        }));
        obs.push(
          profileService.saveMediaFile({
            isUrl: coverImage.isUrl,
            content: coverImage.src,
            name: ProfileProviderProperties.COVER_IMAGE,
          }),
        );
      } else {
        obs.push(Promise.resolve(null));
      }

      if (userName && !profile.userName) {
        obs.push(profileService.registerUserName({ userName }));
      } else {
        obs.push(Promise.resolve(null));
      }

      const ipfsSettings = ipfsService.getSettings({});
      forkJoin([...obs, ipfsSettings]).subscribe((responses: any[]) => {
        const [avatarRes, coverImageRes, userNameRes, ipfsSettingsRes] = responses;
        const ipfsGateway = ipfsSettingsRes.data;
        setUpdateStatus(prev => ({
          ...prev,
          uploadingAvatar: false,
          uploadingCoverImage: false,
        }));
        const providers: any[] = [];

        if (!avatarRes && avatar === null) {
          providers.push({
            provider: ProfileProviders.EWA_BASIC,
            property: ProfileProviderProperties.AVATAR,
            value: '',
          });
        }
        if (avatarRes && avatarRes.data) {
          providers.push({
            provider: ProfileProviders.EWA_BASIC,
            property: ProfileProviderProperties.AVATAR,
            value: avatarRes.data.CID,
          });
        }
        if (!coverImageRes && coverImage === null) {
          providers.push({
            provider: ProfileProviders.EWA_BASIC,
            property: ProfileProviderProperties.COVER_IMAGE,
            value: '',
          });
        }
        if (coverImageRes && coverImageRes.data) {
          providers.push({
            provider: ProfileProviders.EWA_BASIC,
            property: ProfileProviderProperties.COVER_IMAGE,
            value: coverImageRes.data.CID,
          });
        }
        if (description) {
          providers.push({
            provider: ProfileProviders.EWA_BASIC,
            property: ProfileProviderProperties.DESCRIPTION,
            value: description,
          });
        }
        if (name) {
          providers.push({
            provider: ProfileProviders.EWA_BASIC,
            property: ProfileProviderProperties.NAME,
            value: name,
          });
        }
        let addProvider = Promise.resolve(null);
        if (userNameRes) {
          providers.push({
            provider: ProfileProviders.EWA_BASIC,
            property: ProfileProviderProperties.USERNAME,
            value: userName,
          });
          addProvider = profileService.addProfileProvider([
            {
              provider: ProfileProviders.EWA_BASIC,
              property: ProfileProviderProperties.USERNAME,
              value: userName,
            },
          ]);
        }

        const makeDefault = profileService.makeDefaultProvider(providers);
        concat(addProvider, makeDefault).subscribe((resp: any) => {
          if (resp && !resp.data) {
            return createErrorHandler(
              'useProfile.nullData',
              false,
              props.onError,
            )(new Error(`Cannot save a provider to your profile.`));
          }
          const updatedFields: { [key: string]: any } = providers
            .map(provider => {
              if (
                (provider.property === ProfileProviderProperties.COVER_IMAGE ||
                  provider.property === ProfileProviderProperties.AVATAR) &&
                !!provider.value
              ) {
                return {
                  [provider.property]: `${ipfsGateway}/${provider.value}`,
                };
              }
              return { [provider.property]: provider.value };
            })
            .reduce((acc, curr) => Object.assign(acc, curr), {});

          if (resp && resp.data.makeDefaultProvider) {
            if (updatedFields.userName && !profile.userName) {
              updatedFields.providers = [
                {
                  provider: ProfileProviders.EWA_BASIC,
                  property: ProfileProviderProperties.USERNAME,
                  value: updatedFields.userName,
                },
              ];
              updatedFields.default = [
                {
                  provider: ProfileProviders.EWA_BASIC,
                  property: ProfileProviderProperties.USERNAME,
                  value: updatedFields.userName,
                },
              ];
            }
            actions.updateProfile(updatedFields);
            setUpdateStatus(prev => ({
              ...prev,
              saving: false,
              updateComplete: true,
            }));
          }
        });
      }, createErrorHandler('useProfile.optimisticUpdate.forkJoin', false, onError));
    },
    updateUsernameProvider({ userName, provider }) {
      setUpdateStatus({
        saving: true,
        updateComplete: false,
        uploadingAvatar: false,
        isValidating: false,
        uploadingCoverImage: false,
        isValidUsername: null,
        notAllowed: false,
      });
      let addProvider = Promise.resolve(null);
      const providerData = {
        provider,
        property: ProfileProviderProperties.USERNAME,
        value: userName,
      };
      if (profile.providers?.length) {
        if (!profile.providers.find(p => p.provider === provider)) {
          addProvider = profileService.addProfileProvider(providerData);
        }
      }

      const makeDefault = profileService.makeDefaultProvider([providerData]);
      concat(addProvider, makeDefault).subscribe((resp: any) => {
        if (resp && resp.channelInfo.method === 'makeDefaultProvider' && !resp.data) {
          return createErrorHandler(
            'useProfile.updateUsernameProvider',
            false,
            props.onError,
          )(new Error('Cannot save default provider'));
        }
        if (resp && resp.data && resp.data.makeDefaultProvider) {
          actions.updateProfile({
            default: [
              ...profile.default!.filter(p => p.property !== ProfileProviderProperties.USERNAME),
              providerData,
            ],
          });
          setUpdateStatus(prev => ({
            ...prev,
            saving: false,
            updateComplete: true,
          }));
        }
      });
    },
    resetUpdateStatus() {
      setUpdateStatus({
        saving: false,
        uploadingAvatar: false,
        uploadingCoverImage: false,
        updateComplete: false,
        isValidUsername: null,
        isValidating: false,
        notAllowed: false,
      });
    },
    resetProfileData() {
      setProfile({});
      actions.resetUpdateStatus();
    },
    getUsernameTypes() {
      // default username is the one set in
      // the onboarding flow (UsernameTypes.TEXTILE)
      const type: UsernameTypes[] = [];

      const defaultProvider = profile.default?.find(
        p => p.property === ProfileProviderProperties.USERNAME,
      );

      if (!defaultProvider || (defaultProvider && defaultProvider.value === null)) {
        return {
          default: defaultProvider,
          available: type,
        };
      }

      if (profile.providers?.length) {
        profile.providers.forEach(provider => {
          if (provider.property === ProfileProviderProperties.USERNAME) {
            if (provider.provider === ProfileProviders.ENS) {
              if (provider.value.endsWith('.akasha.eth')) {
                type.push(UsernameTypes.AKASHA_ENS_SUBDOMAIN);
              } else if (provider.value.endsWith('.eth')) {
                type.push(UsernameTypes.ENS_DOMAIN);
              }
            }
            if (provider.provider === ProfileProviders.EWA_BASIC) {
              type.push(UsernameTypes.TEXTILE);
            }
          }
        });
      }
      return {
        default: defaultProvider,
        available: type,
      };
    },
  };

  return [profile, actions, updateStatus];
};

export default useProfile;
