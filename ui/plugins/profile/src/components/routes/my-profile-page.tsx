import * as React from 'react';
import DS from '@akashaproject/design-system';
import { MyProfilePageHeader } from '../ProfileHeader/my-profile-header';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';
import useProfile from '../hooks/use-profile';

const MyProfilePage = (props: RootComponentProps) => {
  const { sdkModules } = props;
  const [loginState, setLoginState] = React.useState<{ ethAddress?: string }>({});
  const [profileState, profileActions] = useProfile({
    onError: err => {
      console.log(err);
    },
    sdkModules: sdkModules,
  });
  React.useEffect(() => {
    const getDeps = sdkModules.commons.cacheService.getStash(null);
    getDeps.subscribe((resp: { data: any }) => {
      const { data } = resp;
      if (data.entries.has('auth')) {
        const authValue = data.cache.get('auth');
        if (authValue.hasOwnProperty('ethAddress')) {
          setLoginState({
            ethAddress: authValue.ethAddress,
          });
        }
      }
    });
  }, []);

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
