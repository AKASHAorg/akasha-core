import * as React from 'react';
import { ProfileCard } from '@akashaproject/design-system';
import { useProfile } from '../../state/profiles';
import { useLoggedProfile } from '../hooks/use-logged-profile';
import {
  fetchProfileData,
  fetchProfileFollowers,
  fetchProfileFollowings,
} from '../../services/profile-service';

// interface IMyProfileProps {

// }

const MyProfilePage = (/* props: IMyProfileProps */) => {
  const [profileState, profileActions] = useProfile();
  useLoggedProfile(profileState.loggedProfile, profileActions);

  React.useEffect(() => {
    if (profileState.loggedProfile) {
      fetchProfileData(profileState.loggedProfile).then(result => {
        profileActions.getProfiles(result);
      });
      fetchProfileFollowers(profileState.loggedProfile).then(result => {
        profileActions.getProfileFollowers(result);
      });
      fetchProfileFollowings(profileState.loggedProfile).then(result => {
        profileActions.getProfileFollowings(result);
      });
    }
  }, [profileState.loggedProfile]);
  console.log(profileState, 'the profile state');
  const loggedProfileData = profileState.profiles.find(
    profile => profile.ethAddress === profileState.loggedProfile,
  );
  return (
    <div>
      {loggedProfileData && (
        <ProfileCard
          onClickApps={() => {}}
          onClickFollowing={() => {}}
          // @ts-ignore
          profileData={loggedProfileData}
          userInfoTitle={'About me'}
          actionsTitle={'Actions'}
          mostPopularActionsTitle={'Most popular actions'}
          followingTitle={'Following'}
          appsTitle={'Apps'}
          usersTitle={'Users'}
          shareProfileText={'Share Profile'}
        />
      )}
    </div>
  );
};

export default MyProfilePage;
