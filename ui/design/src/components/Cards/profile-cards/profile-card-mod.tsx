import { Box, Text } from 'grommet';
import React, { useState } from 'react';

import { MainAreaCardBox } from '../common/basic-card-box';
import { SubtitleTextIcon, TextIcon } from '../../TextIcon';
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
    onClickFollowing,
    onClickApps,
    profileData,
    descriptionLabel,
    actionsLabel,
    followingLabel,
    usersLabel,
    shareProfileLabel,
    appsLabel,
    changeCoverImageLabel,
  } = props;

  const leftTitle = profileData.following ? profileData.following : profileData.users;
  const rightTitle = profileData.apps ? profileData.apps : profileData.actions;
  const leftSubtitle = profileData.profileType === 'dapp' ? usersLabel : followingLabel;
  const rightSubtitle = profileData.profileType === 'dapp' ? actionsLabel : appsLabel;

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
        height="70px"
        border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'bottom' }}
        margin={{ horizontal: 'medium' }}
        direction="row"
        justify="between"
      >
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
        <Box direction="row" align="center">
          {leftTitle && rightTitle && (
            <Box
              margin={{ right: 'large' }}
              pad={{ vertical: 'medium', right: 'xxsmall' }}
              direction="row"
              alignContent="center"
              gap="small"
            >
              <SubtitleTextIcon
                iconType="person"
                label={leftTitle}
                labelSize="small"
                subtitle={leftSubtitle}
                onClick={onClickFollowing}
                data-testid="following-button"
              />
              <SubtitleTextIcon
                iconType="app"
                label={rightTitle}
                labelSize="small"
                subtitle={rightSubtitle}
                onClick={onClickApps}
                data-testid="apps-button"
              />
            </Box>
          )}
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
