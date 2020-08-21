import * as React from 'react';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useRouteMatch } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { generateProfileData } from '../../services/dummy-data';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';

const { ProfileMiniCard } = DS;

const ProfileCardWidget: React.FC<RootComponentProps> = _props => {
  const { params } = useRouteMatch<{ userId: string }>();
  const [profile, setProfile] = React.useState<{
    ethAddress: string | null;
    profileData: IProfileData | null;
    loading: boolean;
  }>({
    ethAddress: null,
    profileData: null,
    loading: false,
  });

  React.useEffect(() => {
    if (params.userId === 'my-profile') {
      setProfile({
        ...profile,
        ethAddress: '0xmy-profile',
        loading: true,
      });
    } else {
      setProfile({
        ...profile,
        ethAddress: '0x123asdasdasdasd',
        loading: true,
      });
    }
  }, [params.userId]);
  React.useEffect(() => {
    if (profile.ethAddress) {
      setProfile({
        ...profile,
        profileData: generateProfileData(profile.ethAddress),
        loading: false,
      });
    }
  }, [profile.ethAddress]);
  return (
    <>
      {profile.ethAddress && profile.loading && <>Loading Profile Data</>}
      {profile.ethAddress && !profile.loading && profile.profileData && (
        <ProfileMiniCard
          profileData={profile.profileData}
          handleFollow={() => {
            // todo
          }}
          handleUnfollow={() => {
            // todo
          }}
        />
      )}
    </>
  );
};

export default ProfileCardWidget;
