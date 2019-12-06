import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useProfile } from '../../state/profiles';

const { styled, ProfileCard } = DS;

const StyledProfileCard = styled(ProfileCard)`
  height: auto;
`;

export interface IProfileHeaderProps {
  profileId: string;
}

export const ProfilePageHeader = (props: IProfileHeaderProps) => {
  const [profileState, profileActions] = useProfile();
  profileActions.getProfilesData({ profile: props.profileId });
  profileActions.getProfileFollowings({ profile: props.profileId });
  profileActions.getProfileFollowers({ profile: props.profileId });
  const profileData = profileState.profiles.find(prof => prof.ethAddress === props.profileId);

  if (!profileData) {
    return null;
  }

  const cardData = {
    ...profileData,
    followers: profileState.followers.find(p => p.profileId === props.profileId)?.followers,
    following: profileState.followings.find(p => p.profileId === props.profileId)?.followings,
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
