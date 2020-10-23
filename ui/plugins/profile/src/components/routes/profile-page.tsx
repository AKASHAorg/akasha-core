import * as React from 'react';
import { ProfilePageHeader } from '../ProfileHeader/profile-header';
import DS from '@akashaproject/design-system';
import useProfile from '../hooks/use-profile';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';
import { useParams } from 'react-router-dom';

const ProfilePage = (props: RootComponentProps) => {
  const { profileId } = useParams();
  const [profileState, profileActions] = useProfile({ onError: (err) => { console.log(err) }, getProfile: props.sdkModules.profiles.profileService.getProfile });

  React.useEffect(() => {
    if (profileId) {
      profileActions.getProfileData({ ethAddress: profileId });
    }
  }, [profileId]);

  return (
    <div>
      <DS.Helmet>
        <title>Profile | {profileId} Page</title>
      </DS.Helmet>
      <ProfilePageHeader profileData={profileState} profileId={profileId} />
    </div>
  );
};

export default ProfilePage;
