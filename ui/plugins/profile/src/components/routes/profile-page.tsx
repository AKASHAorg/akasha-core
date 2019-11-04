import * as React from 'react';
import { useProfile } from '../../state/profiles';
import { useLoggedProfile } from '../hooks/use-logged-profile';
import { History } from 'history';

interface ProfilePageProps {
  match: {
    params: {
      profileId: string;
    };
  };
  history: History;
}

const ProfilePage = (props: ProfilePageProps) => {
  const { params } = props.match;
  const [profileState, profileActions] = useProfile();
  useLoggedProfile(profileState.loggedProfile, profileActions);
  React.useEffect(() => {
    if (profileState.loggedProfile === params.profileId) {
      props.history.replace('/profile/my-profile');
    }
  }, [profileState.loggedProfile, params.profileId]);

  return <div>Profile of {params.profileId}</div>;
};

export default ProfilePage;
