import * as React from 'react';
import { ProfileCard } from '@akashaproject/design-system';
import { useProfile } from '../../state/profiles';
import { useLoggedProfile } from '../hooks/use-logged-profile';
import {
  fetchProfileData,
  fetchProfileFollowers,
  fetchProfileFollowings,
} from '../../services/profile-service';

interface IMyProfileProps {}

const MyProfilePage = (props: IMyProfileProps) => {
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

  const loggedProfileData = profileState.profiles.find(
    profile => profile.ethAddress === profileState.loggedProfile,
  );

  const profileFollowers = profileState.followers.find(
    profile => profile.profileId === profileState.loggedProfile,
  );

  const profileFollowings = profileState.followings.find(
    profile => profile.profileId === profileState.loggedProfile,
  );

  const profileData = {
    followers: profileFollowers ? profileFollowers.followers : null,
    following: profileFollowings ? profileFollowings.followings : null,
    profileType: 'user',
    apps: '10',
    ...loggedProfileData,
  };

  return (
    <div>
      {loggedProfileData && profileFollowers && profileFollowings && (
        <ProfileCard
          onClickApps={() => {}}
          onClickFollowing={() => {}}
          // @ts-ignore
          profileData={profileData}
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
