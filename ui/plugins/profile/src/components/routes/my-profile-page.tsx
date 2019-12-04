import * as React from 'react';
import { useProfile } from '../../state/profiles';
import { ProfilePageFeed } from '../ProfileFeed/profile-page-feed';
import { MyProfilePageHeader } from '../ProfileHeader/my-profile-header';

const MyProfilePage = () => {
  const [profileState, profileActions] = useProfile();
  profileActions.getLoggedProfile();
  if (!profileState.loggedProfile) {
    return null;
  }

  return (
    <div>
      <React.Suspense fallback={<div>Loading Profile Header</div>}>
        <MyProfilePageHeader />
      </React.Suspense>
      <React.Suspense fallback={<div>Loading Profile Feed</div>}>
        <ProfilePageFeed profileId={profileState.loggedProfile} />
      </React.Suspense>
    </div>
  );
};

export default MyProfilePage;
