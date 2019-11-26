import * as React from 'react';
import { ProfileCard } from '@akashaproject/design-system';
import { useProfile, useProfileState } from '../../state/profiles';
// import { useLoggedProfile } from '../hooks/use-logged-profile';
import { History } from 'history';
import {
  fetchProfileData,
  fetchProfileFollowers,
  fetchProfileFollowings,
} from '../../services/profile-service';
// import { autoDispatch } from '../../state/fetcher';

interface IMyProfileProps {
  history: History;
}

const MyProfilePage = (props: IMyProfileProps) => {
  const [profileState, profileActions] = useProfile();
  console.log(props, 'my profile page props');
  React.useEffect(() => {
    if (profileState.loggedProfile) {
      fetchProfileData(profileState.loggedProfile).then(result => {
        profileActions.getProfilesData(result);
      });
      fetchProfileFollowers(profileState.loggedProfile).then(result => {
        profileActions.getProfileFollowers(result);
      });
      fetchProfileFollowings(profileState.loggedProfile).then(result => {
        profileActions.getProfileFollowings(result);
      });
    }
  }, [profileState.loggedProfile]);

  return (
    <div>
      <React.Suspense fallback={<>Loading Profile</>}>
        <ProfilePageHeader />
      </React.Suspense>
      <React.Suspense fallback={<>Loading Profile Feed</>}>
        <ProfilePageFeed />
      </React.Suspense>
    </div>
  );
};

const ProfilePageFeed = () => {
  return <div>The feed</div>;
};
interface IProfilePageHeaderProps {
  // profileDataFetcher: any;
}

const ProfilePageHeader = (props: IProfilePageHeaderProps) => {
  const profileState = useProfileState();
  // const { profileDataFetcher } = props;
  // profileDataFetcher.run();
  console.log(props, 'profile page header props');
  const profileData = {
    ...profileState.profiles.find(prof => prof.ethAddress === profileState.loggedProfile),
  };

  return (
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
  );
};

export default MyProfilePage;
