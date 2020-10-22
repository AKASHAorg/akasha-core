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
    const $stash = sdkModules.commons.cache_service.getStash(null);
    const getDeps = forkJoin({
      stash: $stash
    })
    getDeps.subscribe((deps: { stash: any }) => {
      const { stash } = deps;
      if (stash.entries.has('auth')) {
        const authValue = stash.get('auth');
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
