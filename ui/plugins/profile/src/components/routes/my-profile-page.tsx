import * as React from 'react';
import DS from '@akashaproject/design-system';
import { MyProfilePageHeader } from '../ProfileHeader/my-profile-header';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';
import { useProfile } from '@akashaproject/ui-awf-hooks';

const MyProfilePage = (props: RootComponentProps) => {
  const { sdkModules, logger } = props;
  const [loginState/* , setLoginState */] = React.useState<{ ethAddress?: string }>({});
  const [profileState, profileActions] = useProfile({
    onError: err => {
      logger.error(err);
    },
    sdkModules: sdkModules,
  });

  React.useEffect(() => {
    if (loginState.ethAddress) {
      profileActions.getProfileData({ ethAddress: loginState.ethAddress });
    }
  }, [loginState]);

  return (
    <div>
      <DS.Helmet>
        <title>Profile | My Page</title>
      </DS.Helmet>
      <MyProfilePageHeader profileData={profileState} />
    </div>
  );
};

export default MyProfilePage;
