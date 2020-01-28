import { Box, Text } from 'grommet';
import React, { useRef, useState } from 'react';
import { Avatar } from '../../Avatar/index';
import { Button, IconButton } from '../../Buttons/index';
import { Icon } from '../../Icon';
import { SelectPopover } from '../../Popovers/index';
import { SubtitleTextIcon } from '../../TextIcon/index';
import { BasicCardBox } from '../index';
import { IProfileWidgetCard } from '../widget-cards/profile-widget-card';
import {
  AvatarDiv,
  ShareButtonContainer,
  StyledAvatarEditDiv,
  StyledCenterDiv,
  StyledEditCoverImageBox,
} from './styled-profile-card';

export interface IProfileProvidersData {
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
  // @TODO fix this
  profileProvidersData?: IProfileProvidersData;
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

  const [editable, setEditable] = useState(false);

  const [avatar, setAvatar] = useState(profileData.avatar);
  const [coverImage, setCoverImage] = useState(profileData.coverImage);
  const [description, setDescription] = useState(profileData.description);
  const [userName, setUserName] = useState(profileData.userName);
  const [name, setName] = useState(profileData.name);

  const [avatarPopoverOpen, setAvatarPopoverOpen] = useState(false);
  const [coverImagePopoverOpen, setCoverImagePopoverOpen] = useState(false);
  const [descriptionPopoverOpen, setDescriptionPopoverOpen] = useState(false);
  const [userNamePopoverOpen, setUserNamePopoverOpen] = useState(false);
  const [namePopoverOpen, setNamePopoverOpen] = useState(false);

  const editAvatarRef: React.Ref<any> = useRef(null);
  const editCoverImageRef: React.Ref<any> = useRef(null);
  const editDescriptionRef: React.Ref<any> = useRef(null);
  const editUserNameRef: React.Ref<any> = useRef(null);
  const editNameRef: React.Ref<any> = useRef(null);

  const handleChangeAvatar = (provider: IProfileDataProvider) => {
    setAvatar(provider.value);
    setAvatarPopoverOpen(false);
  };

  const handleChangeCoverImage = (provider: IProfileDataProvider) => {
    setCoverImage(provider.value);
    setCoverImagePopoverOpen(false);
  };

  const handleChangeDescription = (provider: IProfileDataProvider) => {
    setDescription(provider.value);
    setDescriptionPopoverOpen(false);
  };

  const handleChangeUserName = (provider: IProfileDataProvider) => {
    setUserName(provider.value);
    setUserNamePopoverOpen(false);
  };

  const handleChangeName = (provider: IProfileDataProvider) => {
    setName(provider.value);
    setNamePopoverOpen(false);
  };

  const handleCancelEdit = () => {
    setAvatar(profileData.avatar);
    setCoverImage(profileData.coverImage);
    setDescription(profileData.description);
    setUserName(profileData.userName);
    setName(profileData.name);

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
      <Box
        height="144px"
        background={coverImage!.startsWith('data:') ? `url(${coverImage})` : coverImage}
        pad="none"
        round={{ corner: 'top', size: 'xsmall' }}
      >
        {!editable && (
          <Box align="end" pad="none">
            <ShareButtonContainer gap="xsmall" direction="row">
              <IconButton
                secondary={true}
                icon={<Icon type="editSimple" color="white" />}
                label={editProfileLabel}
                onClick={handleEditClick}
              />
              <IconButton
                secondary={true}
                icon={<Icon type="reply" color="white" />}
                label={shareProfileLabel}
              />
            </ShareButtonContainer>
          </Box>
        )}
        {editable && (
          <Box justify="center" fill="vertical">
            <StyledEditCoverImageBox
              direction="row"
              gap="xsmall"
              justify="center"
              onClick={() => setCoverImagePopoverOpen(true)}
            >
              <Text size="medium" color="white">
                {changeCoverImageLabel}
              </Text>
              <StyledCenterDiv ref={editCoverImageRef}>
                <Icon type="editSimple" />
              </StyledCenterDiv>
            </StyledEditCoverImageBox>
          </Box>
        )}
        {editCoverImageRef.current &&
          coverImagePopoverOpen &&
          profileProvidersData?.coverImageProviders?.length && (
            <SelectPopover
              currentValue={coverImage}
              target={editCoverImageRef.current}
              dataSource={profileProvidersData.coverImageProviders}
              onClickElem={handleChangeCoverImage}
              closePopover={() => {
                setCoverImagePopoverOpen(false);
              }}
            />
          )}
      </Box>
      <Box
        height="70px"
        border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'bottom' }}
        margin={{ horizontal: 'medium' }}
        direction="row"
        justify="between"
      >
        <Box direction="row">
          <AvatarDiv>
            <Avatar size="xl" withBorder={true} ethAddress={profileData.ethAddress} src={avatar} />
            {editable && (
              <StyledAvatarEditDiv ref={editAvatarRef}>
                <Icon
                  clickable={true}
                  type="editSimple"
                  default={true}
                  onClick={() => {
                    setAvatarPopoverOpen(true);
                  }}
                />
              </StyledAvatarEditDiv>
            )}
          </AvatarDiv>
          <Box pad={{ vertical: 'small', left: 'xsmall' }}>
            <Box direction="row" gap="xsmall">
              <Text size="xlarge" weight="bold" color="primaryText">
                {name}
              </Text>
              {editable && (
                <StyledCenterDiv ref={editNameRef}>
                  <Icon
                    clickable={true}
                    type="editSimple"
                    default={true}
                    onClick={() => {
                      setNamePopoverOpen(true);
                    }}
                  />
                </StyledCenterDiv>
              )}
            </Box>

            <Box direction="row" gap="xsmall">
              <Text size="medium" color="secondaryText">
                {userName ? userName : profileData.ethAddress}
              </Text>
              {editable && (
                <StyledCenterDiv ref={editUserNameRef}>
                  <Icon
                    clickable={true}
                    type="editSimple"
                    default={true}
                    onClick={() => {
                      setUserNamePopoverOpen(true);
                    }}
                  />
                </StyledCenterDiv>
              )}
            </Box>
          </Box>
          {editAvatarRef.current &&
            avatarPopoverOpen &&
            profileProvidersData &&
            profileProvidersData.avatarProviders &&
            profileProvidersData.avatarProviders.length !== 0 && (
              <SelectPopover
                currentValue={avatar}
                target={editAvatarRef.current}
                dataSource={profileProvidersData.avatarProviders}
                onClickElem={handleChangeAvatar}
                closePopover={() => {
                  setAvatarPopoverOpen(false);
                }}
              />
            )}
          {editNameRef.current &&
            namePopoverOpen &&
            profileProvidersData &&
            profileProvidersData.nameProviders &&
            profileProvidersData.nameProviders.length !== 0 && (
              <SelectPopover
                currentValue={name}
                target={editNameRef.current}
                dataSource={profileProvidersData.nameProviders}
                onClickElem={handleChangeName}
                closePopover={() => {
                  setNamePopoverOpen(false);
                }}
              />
            )}
          {editUserNameRef.current &&
            userNamePopoverOpen &&
            profileProvidersData &&
            profileProvidersData.userNameProviders &&
            profileProvidersData.userNameProviders.length !== 0 && (
              <SelectPopover
                currentValue={userName}
                target={editUserNameRef.current}
                dataSource={profileProvidersData.userNameProviders}
                onClickElem={handleChangeUserName}
                closePopover={() => {
                  setUserNamePopoverOpen(false);
                }}
              />
            )}
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
      <Box direction="column" pad="medium" gap="medium">
        <Box direction="row" gap="xsmall" align="center">
          <Text size="large" weight="bold" color="primaryText">
            {descriptionLabel}
          </Text>
          {editable && (
            <StyledCenterDiv ref={editDescriptionRef}>
              <Icon
                clickable={true}
                type="editSimple"
                default={true}
                onClick={() => {
                  setDescriptionPopoverOpen(true);
                }}
              />
            </StyledCenterDiv>
          )}
        </Box>

        <Text color="primaryText">{description}</Text>
      </Box>
      {editDescriptionRef.current &&
        descriptionPopoverOpen &&
        profileProvidersData &&
        profileProvidersData.descriptionProviders &&
        profileProvidersData.descriptionProviders.length && (
          <SelectPopover
            currentValue={description}
            target={editDescriptionRef.current}
            dataSource={profileProvidersData.descriptionProviders}
            onClickElem={handleChangeDescription}
            closePopover={() => {
              setDescriptionPopoverOpen(false);
            }}
          />
        )}
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
