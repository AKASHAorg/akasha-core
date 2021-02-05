import * as React from 'react';
import { forkJoin } from 'rxjs';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { createErrorHandler } from './utils/error-handler';
import { getMediaUrl } from './utils/media-utils';

type voidFunc<T = object> = (arg: T) => void;

export interface UseProfileActions {
  getProfileData: voidFunc<{ ethAddress: string }>;
  /* update profile locally */
  updateProfile: voidFunc<Partial<IProfileData>>;
  getEntryAuthor: voidFunc<{ entryId: string }>;
}

export interface UseProfileProps {
  onError?: (error: IAkashaError) => void;
  ipfsService: any;
  profileService: any;
  postsService?: any;
}

export const getMediaUrl = (ipfsGateway: string, hash?: string, data?: any) => {
  let ipfsUrl = '';

  if (hash && !data) {
    ipfsUrl = `${ipfsGateway}/${hash}`;
  }

  if (data) {
    let imageSize = '';
    for (const size in data) {
      if (data.hasOwnProperty(size)) {
        imageSize = size;
        break;
      }
    }
    if (imageSize) {
      ipfsUrl = `${ipfsGateway}/${hash}/${imageSize}/src`;
    }
  }
  return ipfsUrl;
};

/* A hook to be used on profile-page */
export const useProfile = (props: UseProfileProps): [Partial<IProfileData>, UseProfileActions] => {
  const { onError, ipfsService, profileService, postsService } = props;
  const [profile, setProfile] = React.useState<Partial<IProfileData>>({});

  const actions: UseProfileActions = {
    getProfileData: payload => {
      try {
        const ipfsGatewayCall = ipfsService.getSettings({});
        const getProfileCall = profileService.getProfile({
          ethAddress: payload.ethAddress,
        });
        const obs = forkJoin([ipfsGatewayCall, getProfileCall]);
        obs.subscribe((resp: any) => {
          if (!resp.length) {
            return;
          }
          const [gatewayResp, profileResp] = resp;
          const { avatar, coverImage, ...other } = profileResp.data.getProfile;
          const images: { avatar?: string; coverImage?: string } = {};
          if (avatar) {
            images.avatar = getMediaUrl(gatewayResp.data, avatar);
          }
          if (coverImage) {
            images.coverImage = getMediaUrl(gatewayResp.data, coverImage);
          }

          setProfile({ ...images, ...other });
        }, createErrorHandler('useProfile.getProfileData.subscription', false, onError));
      } catch (err) {
        createErrorHandler('useProfile.getProfileData', false, onError)(err);
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
  };

  return [profile, actions];
};

export default useProfile;
