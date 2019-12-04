import * as React from 'react';
import { useProfile } from '../../state/profiles';
import { History } from 'history';
import { ProfilePageFeed } from '../ProfileFeed/profile-page-feed';
import { ProfilePageHeader } from '../ProfileHeader/profile-header';

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
  profileActions.getLoggedProfile();
  React.useEffect(() => {
    if (profileState.loggedProfile === params.profileId) {
      props.history.replace('/profile/my-profile');
    }
  }, [profileState.loggedProfile, params.profileId]);

  return (
    <div>
      <React.Suspense fallback={<div>Loading Profile Header</div>}>
        <ProfilePageHeader profileId={params.profileId} />
      </React.Suspense>
      <React.Suspense fallback={<div>Loading Profile Feed</div>}>
        <ProfilePageFeed profileId={params.profileId} />
      </React.Suspense>
    </div>
  );
};

export default ProfilePage;
