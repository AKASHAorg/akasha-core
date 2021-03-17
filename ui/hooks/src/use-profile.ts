import * as React from 'react';
import { forkJoin } from 'rxjs';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
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
            name: 'avatar',
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
            name: 'coverImage',
          }),
        );
      } else {
        // setting to null will not do anything
        obs.push(Promise.resolve(null));
      }

      const ipfsSettings = ipfsService.getSettings({});
      forkJoin([...obs, ipfsSettings]).subscribe((responses: any[]) => {
        const [avatarRes, coverImageRes, ipfsSettingsRes] = responses;
        const ipfsGateway = ipfsSettingsRes.data;

        setUpdateStatus(prev => ({
          ...prev,
          uploadingAvatar: false,
          uploadingCoverImage: false,
        }));
        const providers: any[] = [];

        if (!avatarRes && avatar === null) {
          providers.push({
            provider: 'ewa.providers.basic',
            property: 'avatar',
            value: '',
          });
        }
        if (avatarRes && avatarRes.data) {
          providers.push({
            provider: 'ewa.providers.basic',
            property: 'avatar',
            value: avatarRes.data.CID,
          });
        }
        if (!coverImageRes && coverImage === null) {
          providers.push({
            provider: 'ewa.providers.basic',
            property: 'coverImage',
            value: '',
          });
        }
        if (coverImageRes && coverImageRes.data) {
          providers.push({
            provider: 'ewa.providers.basic',
            property: 'coverImage',
            value: coverImageRes.data.CID,
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
        if (userName) {
          providers.push({
            provider: 'ewa.providers.basic',
            property: 'userName',
            value: userName,
          });
        }
        const makeDefault = profileService.makeDefaultProvider(providers);
        makeDefault.subscribe((_res: any) => {
          const updatedFields = providers
            .map(provider => {
              if (
                (provider.property === 'coverImage' || provider.property === 'avatar') &&
                !!provider.value
              ) {
                return {
                  [provider.property]: `${ipfsGateway}/${provider.value}`,
                };
              }
              return { [provider.property]: provider.value };
            })
            .reduce((acc, curr) => Object.assign(acc, curr), {});
          actions.updateProfile(updatedFields);
          setUpdateStatus(prev => ({
            ...prev,
            saving: false,
            updateComplete: true,
          }));
        }, createErrorHandler('useLoginState.optimisticUpdate.makeDefault', false, onError));
      }, createErrorHandler('useLoginState.optimisticUpdate.forkJoin', false, onError));
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
  };

  return [profile, actions, updateStatus];
};

export default useProfile;
