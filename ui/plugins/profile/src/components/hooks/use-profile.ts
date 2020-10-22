import * as React from 'react';
import { IProfile } from '@akashaproject/design-system/lib/components/Cards/widget-cards/trending-widget-card';
import { Observable } from 'rxjs';

export interface HookErrorObj {
  errorKey: string;
  error: Error;
  critical: boolean;
}

type voidFunc<T = Object> = (arg?: T) => void;

export interface UseProfileActions {
  getProfileData: voidFunc<{ ethAddress: string }>;
}

export interface UseProfileProps {
  onError: (error: HookErrorObj) => void;
  getProfile: (identifier: { address: string }) => Observable<IProfile>
}

/* A hook to be used on profile-page */
export const useProfile = (props: UseProfileProps): [Partial<IProfile>, UseProfileActions] => {
  const { onError, getProfile } = props;
  const [profile, setProfile] = React.useState<Partial<IProfile>>({});

  const actions = {
    getProfileData: (payload: { ethAddress: string }) => {
      try {
        const obs = getProfile({ address: payload.ethAddress });
        obs.subscribe(resp => {
          console.log(resp, 'profile response');
          setProfile({
            ethAddress: payload.ethAddress,
            userName: 'Test Name',
          })
        }, (err) => onError({ errorKey: 'useProfile.getProfileData[subscription]', error: err, critical: false }));
      } catch (err) {
        onError({
          errorKey: 'useProfile.getProfileData',
          error: err,
          critical: false
        });
      }
    },
  }

  return [profile, actions];
}

export default useProfile;
