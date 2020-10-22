import * as React from 'react';
import { ProfilePageHeader } from '../ProfileHeader/profile-header';
import DS from '@akashaproject/design-system';
import useProfile from '../hooks/use-profile';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';
import { useParams } from 'react-router';

const ProfilePage = (props: RootComponentProps) => {
  const { params } = useParams();
  const [profileState, profileActions] = useProfile({ onError: (err) => { console.log(err) }, getProfile: props.sdkModules.profiles.profileService.getProfile });

  React.useEffect(() => {
    if (params.profileId) {
      profileActions.getProfileData({ ethAddress: params.profileId });
    }
  }, [params.profileId]);

  console.log(profileState, 'profile state');

  return (
    <div>
      <DS.Helmet>
        <title>Profile | {params.profileId} Page</title>
      </DS.Helmet>
      <ProfilePageHeader profileData={profileState} profileId={params.profileId} />
    </div>
  );
};

export default ProfilePage;
