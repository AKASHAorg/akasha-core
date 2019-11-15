import { Box, Image, Text, TextArea, TextInput } from 'grommet';
import * as React from 'react';
import MarginInterface from '../../interfaces/margin.interface';
import { Icon } from '../Icon';
import IconButton from '../IconButton/icon-button';
import { SubtitleTextIcon, TextIcon } from '../TextIcon/index';
import { IActionType } from '../TextIcon/text-icon';
import { BasicCardBox } from './index';
import { AvatarDiv, ShareButtonContainer, StyledImageInput } from './styled-profile-card';

export interface IProfileData {
  avatar?: string;
  coverImage?: string;
  userName?: string;
  description?: string;
  name?: string;
  email?: string;
  url?: string;
  address?: string;
  ethAddress: string;
  // app specific
  followers?: string;
  following?: string;
  apps?: string;
  profileType: string;
  users?: string;
  actions?: string;
  mostPopularActions?: IActionType[];
  vnd: { [key: string]: string };
}

export interface IProfileCardProps {
  className?: string;
  onClickApps: React.EventHandler<React.SyntheticEvent>;
  onClickFollowing: React.EventHandler<React.SyntheticEvent>;
  onChangeProfileData: (newProfileData: IProfileData) => void;
  margin?: MarginInterface;
  profileData: IProfileData;
  userInfoTitle: string;
  actionsTitle: string;
  followingTitle: string;
  appsTitle: string;
  usersTitle: string;
  mostPopularActionsTitle: string;
  shareProfileText: string;
  editable: boolean;
}

const getEditableTextFieldHandlers = (
  editable: boolean,
  setEditField: React.Dispatch<React.SetStateAction<boolean>>,
  setNewValue: React.Dispatch<React.SetStateAction<string>>,
  onChange: () => void,
) => {
  const handleClick = () => editable && setEditField(true);
  const handleBlur = () => {
    if (editable) {
      setEditField(false);
      onChange();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setNewValue(e.target.value);
  };

  return {
    handleClick,
    handleBlur,
    handleChange,
  };
};

const getEditableImageFieldHandlers = (
  editable: boolean,
  imageRef: React.MutableRefObject<HTMLInputElement>,
  setNewValue: React.Dispatch<React.SetStateAction<string>>,
  onChange: (newValue: string) => void,
) => {
  const handleClick = () => {
    if (editable && imageRef.current) {
      imageRef.current.click();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editable) {
      return;
    }

    if (!(e.target.files && e.target.files[0])) {
      setNewValue('');
      onChange('');

      return;
    }

    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      const result = fileReader.result as string;

      setNewValue(result);
      onChange(result);
    });

    fileReader.readAsDataURL(file);
  };

  return {
    handleClick,
    handleChange,
  };
};

const ProfileCard: React.FC<IProfileCardProps> = props => {
  const {
    className,
    onClickFollowing,
    onClickApps,
    onChangeProfileData,
    profileData,
    userInfoTitle,
    actionsTitle,
    followingTitle,
    usersTitle,
    mostPopularActionsTitle,
    shareProfileText,
    appsTitle,
    editable,
  } = props;

  const leftTitle = profileData.following ? profileData.following : profileData.users;
  const rightTitle = profileData.apps ? profileData.apps : profileData.actions;
  const leftSubtitle = profileData.profileType === 'dapp' ? usersTitle : followingTitle;
  const rightSubtitle = profileData.profileType === 'dapp' ? actionsTitle : appsTitle;

  const [newCoverImage, setNewCoverImage] = React.useState(profileData.coverImage);
  const coverImageRef: React.MutableRefObject<HTMLInputElement> = React.useRef();
  const {
    handleClick: handleCoverImageClick,
    handleChange: handleCoverImageChange,
  } = getEditableImageFieldHandlers(editable, coverImageRef, setNewCoverImage, (newValue: string) =>
    onChangeProfileData({
      ...profileData,
      coverImage: newValue,
    }),
  );

  const [newAvatar, setNewAvatar] = React.useState(profileData.avatar);
  const avatarRef: React.MutableRefObject<HTMLInputElement> = React.useRef();
  const {
    handleClick: handleAvatarClick,
    handleChange: handleAvatarChange,
  } = getEditableImageFieldHandlers(editable, avatarRef, setNewAvatar, (newValue: string) =>
    onChangeProfileData({
      ...profileData,
      avatar: newValue,
    }),
  );

  const [editName, setEditName] = React.useState(false);
  const [newName, setNewName] = React.useState(profileData.name);
  const {
    handleClick: handleNameClick,
    handleBlur: handleNameBlur,
    handleChange: handleNameChange,
  } = getEditableTextFieldHandlers(editable, setEditName, setNewName, () =>
    onChangeProfileData({
      ...profileData,
      name: newName,
    }),
  );

  const [editDescription, setEditDescription] = React.useState(false);
  const [newDescription, setNewDescription] = React.useState(profileData.description);
  const {
    handleClick: handleDescriptionClick,
    handleBlur: handleDescriptionBlur,
    handleChange: handleDescriptionChange,
  } = getEditableTextFieldHandlers(editable, setEditDescription, setNewDescription, () =>
    onChangeProfileData({
      ...profileData,
      description: newDescription,
    }),
  );

  return (
    <BasicCardBox className={className}>
      <Box
        height="144px"
        background={newCoverImage.startsWith('data:') ? `url(${newCoverImage})` : newCoverImage}
        pad="none"
        round={{ corner: 'top', size: 'xsmall' }}
        align="end"
        onClick={handleCoverImageClick}
      >
        <ShareButtonContainer>
          <IconButton share={true} icon={<Icon type="share" />} label={shareProfileText} />
        </ShareButtonContainer>

        <StyledImageInput
          ref={coverImageRef}
          name="coverImage"
          type="file"
          onChange={handleCoverImageChange}
        />
      </Box>
      <Box
        height="70px"
        border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'bottom' }}
        margin={{ horizontal: 'medium' }}
        direction="row"
        justify="between"
      >
        <Box direction="row">
          <AvatarDiv onClick={handleAvatarClick}>
            {newAvatar && (
              <Image
                src={newAvatar}
                fit="cover"
                width="76px"
                height="76px"
                style={{ borderRadius: '100%' }}
              />
            )}

            <StyledImageInput
              ref={avatarRef}
              name="avatar"
              type="file"
              onChange={handleAvatarChange}
            />
          </AvatarDiv>
          <Box pad={{ vertical: 'small', left: 'xsmall' }}>
            {!editName && (
              <Text size="xlarge" weight="bold" color="primaryText" onClick={handleNameClick}>
                {newName}
              </Text>
            )}
            {editName && (
              <TextInput
                plain={true}
                name="name"
                size="xlarge"
                color="primaryText"
                value={newName}
                onBlur={handleNameBlur}
                onChange={handleNameChange}
              />
            )}
            <Text size="medium" color="secondaryText">
              {profileData.userName ? profileData.userName : profileData.ethAddress}
            </Text>
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
            />
            <SubtitleTextIcon
              iconType="app"
              label={rightTitle}
              labelSize="small"
              subtitle={rightSubtitle}
              onClick={onClickApps}
            />
          </Box>
        )}
      </Box>
      {profileData.profileType === 'dapp' && profileData.mostPopularActions && (
        <Box direction="column" pad={{ horizontal: 'medium', top: 'medium' }} gap="medium">
          <Text size="large" weight="bold" color="primaryText">
            {mostPopularActionsTitle}
          </Text>
          <Box pad="none" gap="medium" direction="row">
            {profileData.mostPopularActions.map((action, index) => (
              <TextIcon
                actionType={action}
                key={index}
                label={action}
                iconType={'app'}
                clickable={true}
              />
            ))}
          </Box>
        </Box>
      )}
      <Box direction="column" pad="medium" gap="medium">
        <Text size="large" weight="bold" color="primaryText">
          {userInfoTitle}
        </Text>

        {!editDescription && (
          <Text color="primaryText" onClick={handleDescriptionClick}>
            {newDescription}
          </Text>
        )}
        {editDescription && (
          <TextArea
            plain={true}
            name="description"
            color="primaryText"
            onBlur={handleDescriptionBlur}
            onChange={handleDescriptionChange}
          >
            {newDescription}
          </TextArea>
        )}
      </Box>
    </BasicCardBox>
  );
};

export default ProfileCard;
