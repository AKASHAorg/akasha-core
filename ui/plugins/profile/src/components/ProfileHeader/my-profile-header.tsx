import * as React from 'react';
import DS from '@akashaproject/design-system';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';

const { styled, ProfileCard } = DS;

const StyledProfileCard = styled(ProfileCard)`
  height: auto;
  margin-bottom: 0.5em;
`;

export const MyProfilePageHeader = (props: { profileData: Partial<IProfileData> }) => {
  const { profileData } = props;

  if (!profileData) {
    return null;
  }

  const cardData = {
    ...profileData,
  };

  return (
    <StyledProfileCard
      onClickApps={() => {}}
      onClickFollowing={() => {}}
      // @ts-ignore
      profileData={cardData}
      canUserEdit={true}
      onChangeProfileData={() => {}}
      getProfileProvidersData={() => {}}
      descriptionLabel={'About me'}
      actionsLabel={'Actions'}
      editProfileLabel={'Edit profile'}
      changeCoverImageLabel={'Change cover image'}
      cancelLabel={'Cancel'}
      saveChangesLabel={'Save changes'}
      followingLabel={'Following'}
      appsLabel={'Apps'}
      usersLabel={'Users'}
      shareProfileLabel={'Share Profile'}
      flaggable={false}
    />
  );
};
