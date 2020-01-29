import { Box, Text } from 'grommet';
import React, { useState } from 'react';
import { Button } from '../../Buttons/index';
import { SubtitleTextIcon } from '../../TextIcon/index';
import { BasicCardBox } from '../index';
import {
  ProfileCardAvatar,
  ProfileCardCoverImage,
  ProfileCardDescription,
  ProfileCardName,
} from './profile-card-fields/index';
import { IProfileWidgetCard } from './profile-widget-card';

export interface IProfileProvidersData {
  currentProviders: {
    avatar?: IProfileDataProvider;
    coverImage?: IProfileDataProvider;
    name?: IProfileDataProvider;
    description?: IProfileDataProvider;
  };
  avatarProviders?: IProfileDataProvider[];
  coverImageProviders?: IProfileDataProvider[];
  userNameProviders?: IProfileDataProvider[];
  nameProviders?: IProfileDataProvider[];
  descriptionProviders?: IProfileDataProvider[];
}

export interface IProfileDataProvider {
  providerName: string;
  providerIcon?: string;
  value: string;
}

export interface IProfileCardProps extends IProfileWidgetCard {
  // edit profile related
  profileProvidersData?: IProfileProvidersData;
  // @TODO fix this
  onChangeProfileData: (newProfileData: any) => void;
  editProfileLabel: string;
  changeCoverImageLabel: string;
  cancelLabel: string;
  saveChangesLabel: string;
  getProfileProvidersData: () => void;
}

const ProfileCard: React.FC<IProfileCardProps> = props => {
  const {
    className,
    onClickFollowing,
    onClickApps,
    onChangeProfileData,
    profileData,
    descriptionLabel,
    actionsLabel,
    followingLabel,
    usersLabel,
    editProfileLabel,
    shareProfileLabel,
    appsLabel,
    changeCoverImageLabel,
    cancelLabel,
    saveChangesLabel,
    getProfileProvidersData,
    profileProvidersData,
  } = props;

  const leftTitle = profileData.following ? profileData.following : profileData.users;
  const rightTitle = profileData.apps ? profileData.apps : profileData.actions;
  const leftSubtitle = profileData.profileType === 'dapp' ? usersLabel : followingLabel;
  const rightSubtitle = profileData.profileType === 'dapp' ? actionsLabel : appsLabel;

  const handleEditClick = () => {
    getProfileProvidersData();
    setEditable(true);
  };

  const handleShareClick = () => {
    // to be implemented
    return;
  };

  const [editable, setEditable] = useState(false);

  const [avatar, setAvatar] = useState(profileData.avatar);
  const [coverImage, setCoverImage] = useState(profileData.coverImage);
  const [description, setDescription] = useState(profileData.description);
  const [name, setName] = useState(profileData.name);

  const [avatarIcon, setAvatarIcon] = useState(
    profileProvidersData?.currentProviders.avatar?.providerIcon,
  );
  const [coverImageIcon, setCoverImageIcon] = useState(
    profileProvidersData?.currentProviders.coverImage?.providerIcon,
  );
  const [descriptionIcon, setDescriptionIcon] = useState(
    profileProvidersData?.currentProviders.description?.providerIcon,
  );
  const [nameIcon, setNameIcon] = useState(
    profileProvidersData?.currentProviders.name?.providerIcon,
  );

  const [avatarPopoverOpen, setAvatarPopoverOpen] = useState(false);
  const [coverImagePopoverOpen, setCoverImagePopoverOpen] = useState(false);
  const [descriptionPopoverOpen, setDescriptionPopoverOpen] = useState(false);
  const [namePopoverOpen, setNamePopoverOpen] = useState(false);

  const handleChangeAvatar = (provider: IProfileDataProvider) => {
    setAvatar(provider.value);
    setAvatarIcon(provider.providerIcon);
    setAvatarPopoverOpen(false);
  };

  const handleChangeCoverImage = (provider: IProfileDataProvider) => {
    setCoverImage(provider.value);
    setCoverImageIcon(provider.providerIcon);
    setCoverImagePopoverOpen(false);
  };

  const handleChangeDescription = (provider: IProfileDataProvider) => {
    setDescription(provider.value);
    setDescriptionIcon(provider.providerIcon);
    setDescriptionPopoverOpen(false);
  };

  const handleChangeName = (provider: IProfileDataProvider) => {
    setName(provider.value);
    setNameIcon(provider.providerIcon);
    setNamePopoverOpen(false);
  };

  const handleCancelEdit = () => {
    // reset to initial state
    setAvatar(profileData.avatar);
    setCoverImage(profileData.coverImage);
    setDescription(profileData.description);
    setName(profileData.name);
    setAvatarIcon(profileProvidersData?.currentProviders.avatar?.providerIcon);
    setCoverImageIcon(profileProvidersData?.currentProviders.coverImage?.providerIcon);
    setDescriptionIcon(profileProvidersData?.currentProviders.description?.providerIcon);
    setNameIcon(profileProvidersData?.currentProviders.name?.providerIcon);
    // turn off editing
    setEditable(false);
  };

  const handleSaveEdit = () => {
    // @TODO construct object
    const newProfileData = {};
    onChangeProfileData(newProfileData);
    setEditable(false);
  };
  return (
    <BasicCardBox className={className}>
      <ProfileCardCoverImage
        shareProfileLabel={shareProfileLabel}
        editProfileLabel={editProfileLabel}
        changeCoverImageLabel={changeCoverImageLabel}
        editable={editable}
        coverImage={coverImage}
        coverImageIcon={coverImageIcon}
        handleChangeCoverImage={handleChangeCoverImage}
        coverImagePopoverOpen={coverImagePopoverOpen}
        setCoverImagePopoverOpen={setCoverImagePopoverOpen}
        handleEditClick={handleEditClick}
        handleShareClick={handleShareClick}
        profileProvidersData={profileProvidersData}
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
            editable={editable}
            avatar={avatar}
            avatarIcon={avatarIcon}
            handleChangeAvatar={handleChangeAvatar}
            avatarPopoverOpen={avatarPopoverOpen}
            setAvatarPopoverOpen={setAvatarPopoverOpen}
            profileProvidersData={profileProvidersData}
          />
          <Box pad={{ vertical: 'small', left: 'xsmall' }}>
            <ProfileCardName
              editable={editable}
              name={name}
              nameIcon={nameIcon}
              handleChangeName={handleChangeName}
              namePopoverOpen={namePopoverOpen}
              setNamePopoverOpen={setNamePopoverOpen}
              profileProvidersData={profileProvidersData}
            />

            <Box direction="row" gap="xsmall">
              <Text size="medium" color="secondaryText">
                {profileData.userName ? profileData.userName : profileData.ethAddress}
              </Text>
            </Box>
          </Box>
        </Box>
        {leftTitle && rightTitle && (
          <Box
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
      <ProfileCardDescription
        editable={editable}
        description={description}
        descriptionIcon={descriptionIcon}
        handleChangeDescription={handleChangeDescription}
        descriptionPopoverOpen={descriptionPopoverOpen}
        setDescriptionPopoverOpen={setDescriptionPopoverOpen}
        profileProvidersData={profileProvidersData}
        descriptionLabel={descriptionLabel}
      />
      <Box height="40px">
        {editable && (
          <div>
            <Box gap="xsmall" direction="row" justify="end" pad={{ horizontal: 'medium' }}>
              <Button label={cancelLabel} onClick={handleCancelEdit} />
              <Button label={saveChangesLabel} onClick={handleSaveEdit} primary={true} />
            </Box>
          </div>
        )}
      </Box>
    </BasicCardBox>
  );
};

export default ProfileCard;
