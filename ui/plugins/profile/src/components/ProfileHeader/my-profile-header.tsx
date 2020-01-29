import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useProfile } from '../../state/profiles';

const { styled, ProfileCard } = DS;

const StyledProfileCard = styled(ProfileCard)`
  height: auto;
  margin-bottom: 0.5em;
`;

export const MyProfilePageHeader = () => {
  const [profileState, profileActions] = useProfile();
  profileActions.getProfilesData({ profile: profileState.loggedProfile });
  profileActions.getProfileFollowings({ profile: profileState.loggedProfile });
  profileActions.getProfileFollowers({ profile: profileState.loggedProfile });
  const profileData = profileState.profiles.find(
    prof => prof.ethAddress === profileState.loggedProfile,
  );

  if (!profileData) {
    return null;
  }

  const cardData = {
    ...profileData,
    followers: profileState.followers.find(p => p.profileId === profileState.loggedProfile)
      ?.followers,
    following: profileState.followings.find(p => p.profileId === profileState.loggedProfile)
      ?.followings,
  };

  return (
    <StyledProfileCard
      onClickApps={() => {}}
      onClickFollowing={() => {}}
      // @ts-ignore
      profileData={cardData}
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
