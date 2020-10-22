import * as React from 'react';
import { History } from 'history';
import { ProfilePageHeader } from '../ProfileHeader/profile-header';
import DS from '@akashaproject/design-system';
import useProfile from '../hooks/use-profile';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';

interface ProfilePageProps {
  match: {
    params: {
      profileId: string;
    };
  };
  history: History;
}

const ProfilePage = (props: ProfilePageProps & RootComponentProps) => {
  const { params } = props.match;
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
      <ProfilePageHeader profileId={params.profileId} />
    </div>
  );
};

export default ProfilePage;
