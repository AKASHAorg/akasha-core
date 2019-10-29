import * as React from 'react';
import { ProfileCard } from '@akashaproject/design-system';
import { useProfile } from '../../state/profiles';

const MyProfilePage = () => {
  const [profileState, profileActions] = useProfile();
  const profileData = {
    avatarImg: 'http://placebeard.it/640/480',
    profileImg: 'goldenrod',
    name: 'Gilbert The Bearded',
    userName: '@gilbert',
    userInfo:
      'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
    followers: '15',
    following: '1876',
    apps: '12',
    profileType: 'user',
  };
  return (
    <div>
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
    </div>
  );
};

export default MyProfilePage;
