import * as React from 'react';
import DS from '@akashaproject/design-system';
import { MyProfilePageHeader } from '../ProfileHeader/my-profile-header';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';
import { forkJoin } from 'rxjs';
import useProfile from '../hooks/use-profile';

const MyProfilePage = (props: RootComponentProps) => {
  const { sdkModules } = props;
  const [ loginState, setLoginState ] = React.useState<{ethAddress?: string}>({});
  const [profileState, profileActions] = useProfile({ onError: (err) => { console.log(err) }, getProfile: sdkModules.profiles.profileService.getProfile });
  React.useEffect(() => {
    const $stash = sdkModules.commons.cacheService.getStash('auth');
    const getDeps = forkJoin({
      stash: $stash
    })
    getDeps.subscribe((resp: { stash: any }) => {
      const { data } = resp.stash;
      if (data.entries.has('auth')) {
        const authValue = data.cache.get('auth');
        console.log(authValue, 'authVal');
        if (authValue.hasOwnProperty('ethAddress')) {
          setLoginState({
            ethAddress: authValue.ethAddress,
          });
        }
      }
    })
  }, []);

  React.useEffect(() => {
    if (loginState.ethAddress) {
      profileActions.getProfileData({ ethAddress: loginState.ethAddress });
    }
  }, [loginState])

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
