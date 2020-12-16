import * as React from 'react';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useRouteMatch } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useProfile } from '@akashaproject/ui-awf-hooks';

const { ProfileMiniCard } = DS;

const ProfileCardWidget: React.FC<RootComponentProps> = props => {
  const { params } = useRouteMatch<{ userId: string }>();

  const [profileState, profileActions] = useProfile({
    onError: err => {
      if (props.logger) {
        props.logger.error('profile-card-widget error %j %j', err);
      }
    },
    ipfsService: props.sdkModules.commons.ipfsService,
    profileService: props.sdkModules.profiles.profileService,
  });

  React.useEffect(() => {
    if (params.userId) {
      profileActions.getProfileData({ ethAddress: params.userId });
    }
  }, [params.userId]);

  return (
    <>
      <ProfileMiniCard
        profileData={profileState as any}
        handleFollow={() => {
          // todo
        }}
        handleUnfollow={() => {
          // todo
        }}
      />
    </>
  );
};

export default ProfileCardWidget;
