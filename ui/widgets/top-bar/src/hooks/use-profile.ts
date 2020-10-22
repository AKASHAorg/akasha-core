import * as React from 'react';
import { Observable } from 'rxjs';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';

export interface HookErrorObj {
  errorKey: string;
  error: Error;
  critical: boolean;
}

type voidFunc<T = object> = (arg?: T) => void;

export interface UseProfileActions {
  getProfileData: voidFunc<{ ethAddress: string }>;
}

export interface UseProfileProps {
  onError: (error: HookErrorObj) => void;
  getProfile: (identifier: { address: string }) => Observable<any>;
}

/* A hook to be used on profile-page */
export const useProfile = (props: UseProfileProps): [Partial<IProfileData>, UseProfileActions] => {
  const { onError, getProfile } = props;
  const [profile, setProfile] = React.useState<Partial<IProfileData>>({});

  const actions = {
    getProfileData: (payload: { ethAddress: string }) => {
      try {
        const obs = getProfile({ address: payload.ethAddress });
        obs.subscribe(
          resp => {
            if (!resp.data) {
              return;
            }
            const { address, username, avatar, backgroundImage, about, data } = resp.data;
            const mappedProfileData: IProfileData = { ethAddress: address };
            if (data && data.firstName && data.lastName) {
              mappedProfileData.userName = `${data.firstName} ${data.lastName}`;
            }
            if (username) {
              mappedProfileData.ensName = username;
            }
            if (avatar) {
              mappedProfileData.avatar = avatar;
            }
            if (backgroundImage) {
              mappedProfileData.coverImage = backgroundImage;
            }
            if (about) {
              mappedProfileData.description = about;
            }
            setProfile(mappedProfileData);
          },
          err =>
            onError({
              errorKey: 'useProfile.getProfileData[subscription]',
              error: err,
              critical: false,
            }),
        );
      } catch (err) {
        onError({
          errorKey: 'useProfile.getProfileData',
          error: err,
          critical: false,
        });
      }
    },
  };

  return [profile, actions];
};

export default useProfile;
