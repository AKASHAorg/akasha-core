import * as React from 'react';
import { IProfile } from '@akashaproject/design-system/lib/components/Cards/widget-cards/trending-widget-card';

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
}

/* A hook to be used on profile-page */
export const useProfile = (props: UseProfileProps): [Partial<IProfile>, UseProfileActions] => {
  const { onError } = props;
  const [profile, setProfile] = React.useState<Partial<IProfile>>({});

  const actions = {
    getProfileData: (payload: { ethAddress: string }) => {
      try {
        setProfile({
          ethAddress: payload.ethAddress,
          userName: 'Test Name',
        })
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
