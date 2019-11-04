import { useEffect } from 'react';
import { fetchLoggedProfile } from '../../services/profile-service';
import { IProfileState } from '../../state/profiles/interfaces';

export const useLoggedProfile = (
  profile: IProfileState['loggedProfile'],
  profileActions: { [key: string]: any },
) => {
  useEffect(() => {
    fetchLoggedProfile().then(result => profileActions.getLoggedProfile(result));
  }, [profile]);
};
