import * as React from 'react';
import { forkJoin } from 'rxjs';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';
import { IAkashaError } from '@akashaproject/ui-awf-typings';


type voidFunc<T = object> = (arg?: T) => void;

export interface UseProfileActions {
  getProfileData: voidFunc<{ ethAddress: string }>;
}

export interface UseProfileProps {
  onError?: (error: IAkashaError) => void;
  ipfsService: any;
  profileService: any;
}

/* A hook to be used on profile-page */
export const useProfile = (props: UseProfileProps): [Partial<IProfileData>, UseProfileActions] => {
  const { onError, ipfsService, profileService } = props;
  const [profile, setProfile] = React.useState<Partial<IProfileData>>({});

  const getMediaUrl = (ipfsGateway: string, hash?: string, data?: any) => {
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

  const actions = {
    getProfileData: (payload: { ethAddress: string }) => {
      try {
        const ipfsGatewayCall = ipfsService.getSettings({});
        const getProfileCall = profileService.getProfile({
          ethAddress: payload.ethAddress,
        });
        const obs = forkJoin([ipfsGatewayCall, getProfileCall]);
        obs.subscribe(
          (resp: any) => {
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
              images.coverImage = getMediaUrl(
                gatewayResp.data,
                coverImage.hash,
                coverImage.data,
              );
            }

            setProfile({ ...images, ...other });
          },
          err => {
            if (onError) {
              onError({
                errorKey: 'useProfile.getProfileData[subscription]',
                error: err,
                critical: false,
              });
            }
          },
        );
      } catch (err) {
        if (onError) {
          onError({
            errorKey: 'useProfile.getProfileData',
            error: err,
            critical: false,
          });
        }
      }
    },
  };

  return [profile, actions];
};

export default useProfile;
