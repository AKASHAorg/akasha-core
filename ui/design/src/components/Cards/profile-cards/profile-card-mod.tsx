import { Box, Text } from 'grommet';
import React, { useState } from 'react';

import { MainAreaCardBox } from '../common/basic-card-box';
import { TextIcon } from '../../TextIcon';
import {
  ProfileCardAvatar,
  ProfileCardCoverImage,
  ProfileCardDescription,
  ProfileCardName,
  ProfileCardEthereumId,
} from './profile-card-fields';
import { IProfileWidgetCard } from './profile-widget-card';

export interface IProfileCardModProps extends IProfileWidgetCard {
  canUserEdit?: boolean;
  onChangeProfileData: (newProfileData: any) => void;
  editProfileLabel?: string;
  changeCoverImageLabel: string;
  onEntryFlag: () => void;
  getProfileProvidersData: () => void;
}

const ProfileCardMod: React.FC<IProfileCardModProps> = props => {
  const {
    className,
    postsLabel,
    followersLabel,
    followingLabel,
    profileData,
    descriptionLabel,
    shareProfileLabel,
    changeCoverImageLabel,
  } = props;

  const postsTitle = `${profileData.totalPosts} ${postsLabel}`;
  const followersTitle = `${profileData.totalFollowers} ${followersLabel}`;
  const followingTitle = `${profileData.totalFollowing} ${followingLabel}`;

  const [avatar, setAvatar] = useState(profileData.avatar);
  const [coverImage, setCoverImage] = useState(profileData.coverImage);
  const [description, setDescription] = useState(profileData.description);
  const [name, setName] = useState(profileData.name);

  React.useEffect(() => {
    setAvatar(profileData.avatar);
    setCoverImage(profileData.coverImage);
    setDescription(profileData.description);
    setName(profileData.name);
  }, [profileData]);

  const onLinkCopy = (CID?: string) => {
    if (CID) {
      navigator.clipboard.writeText(CID);
    }
  };
  return (
    <MainAreaCardBox className={className}>
      <ProfileCardCoverImage
        shareProfileLabel={shareProfileLabel}
        changeCoverImageLabel={changeCoverImageLabel}
        editable={false}
        coverImage={coverImage}
        handleChangeCoverImage={() => null}
        coverImagePopoverOpen={false}
        setCoverImagePopoverOpen={() => null}
        handleShareClick={() => null}
      />
      <Box
        direction="column"
        border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'bottom' }}
        margin={{ horizontal: 'medium' }}
      >
        <Box height="70px" direction="row" justify="between">
          <Box direction="row">
            <ProfileCardAvatar
              ethAddress={profileData.ethAddress}
              editable={false}
              avatar={avatar}
              handleChangeAvatar={() => null}
              avatarPopoverOpen={false}
              setAvatarPopoverOpen={() => null}
            />
            <Box pad={{ vertical: 'small', left: 'xsmall' }}>
              <ProfileCardName
                editable={false}
                name={name}
                handleChangeName={() => null}
                namePopoverOpen={false}
                setNamePopoverOpen={() => null}
              />

              <Box direction="row" gap="xsmall">
                <Text size="medium" color="secondaryText">
                  {profileData.userName ? profileData.userName : null}
                </Text>
              </Box>
            </Box>
          </Box>

          <Box pad={{ vertical: 'medium' }} direction="row" alignContent="center" gap="medium">
            <TextIcon
              iconType="quote"
              iconBackground={true}
              iconSize="xxs"
              label={postsTitle}
              fadedText={true}
              data-testid="posts-button"
            />
            <TextIcon
              iconType="following"
              iconBackground={true}
              iconSize="xxs"
              label={followersTitle}
              fadedText={true}
              data-testid="followers-button"
            />
            <TextIcon
              iconType="following"
              iconBackground={true}
              iconSize="xxs"
              label={followingTitle}
              fadedText={true}
              data-testid="following-button"
            />
          </Box>
        </Box>
      </Box>
      <ProfileCardEthereumId profileData={profileData} />
      {description && (
        <ProfileCardDescription
          descriptionLabel={descriptionLabel}
          editable={false}
          description={description}
          descriptionIcon={undefined}
          handleChangeDescription={() => null}
          descriptionPopoverOpen={false}
          setDescriptionPopoverOpen={() => null}
        />
      )}
      {profileData.CID && (
        <>
          <Box direction="column" pad="medium" gap="medium">
            <Box direction="row" gap="xsmall" align="center">
              <Text size="large" weight="bold" color="primaryText">
                {`CID`}
              </Text>
            </Box>

            <TextIcon
              iconType="copy"
              label={profileData.CID}
              onClick={() => onLinkCopy(profileData.CID)}
              clickable={true}
              iconSize="xs"
              fontSize="medium"
              reverse={true}
            />
          </Box>
        </>
      )}
    </MainAreaCardBox>
  );
};

export default ProfileCardMod;
