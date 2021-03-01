import { Box, Text } from 'grommet';
import React, { useState } from 'react';
import { IconButton, DuplexButton } from '../../Buttons/index';
import { Icon } from '../../Icon';
import { TextIcon } from '../../TextIcon/index';
import { MainAreaCardBox } from '../common/basic-card-box';
import CardHeaderMenuDropdown from '../entry-cards/card-header-menu';
import {
  ProfileCardAvatar,
  ProfileCardCoverImage,
  ProfileCardDescription,
  ProfileCardName,
  ProfileCardEthereumId,
} from './profile-card-fields/index';
import { IProfileWidgetCard } from './profile-widget-card';
import { LogoSourceType } from '@akashaproject/ui-awf-typings/lib/index';
import ProfileEditMenuDropdown from './profile-card-edit-dropdown';
import styled from 'styled-components';
import { truncateMiddle } from '../../../utils/string-utils';

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
  providerIcon?: LogoSourceType;
  value: string;
}

export interface IProfileCardProps extends IProfileWidgetCard {
  // edit profile related
  profileProvidersData?: IProfileProvidersData;
  canUserEdit?: boolean;
  // @TODO fix this
  onChangeProfileData?: (newProfileData: any) => void;
  editProfileLabel?: string;
  changeCoverImageLabel?: string;
  cancelLabel?: string;
  saveChangesLabel?: string;
  flagAsLabel?: string;
  flaggable: boolean;
  onEntryFlag: () => void;
  getProfileProvidersData?: () => void;
  onUpdateClick: () => void;
  onENSChangeClick: () => void;
  handleShareClick: () => void;
  updateProfileLabel?: string;
  changeENSLabel?: string;
  hideENSButton?: boolean;
}

const EditButton = styled(IconButton)`
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  min-height: 1.375rem;
  svg * {
    stroke: ${props => props.theme.colors.white};
  }
  &:hover {
    svg * {
      stroke: ${props => props.theme.colors.blue};
    }
  }
`;

// tslint:disable:cyclomatic-complexity
/* eslint-disable complexity */
const ProfileCard: React.FC<IProfileCardProps> = props => {
  const {
    className,
    loggedEthAddress,
    onClickFollowing,
    onClickFollowers,
    onClickPosts,
    handleFollow,
    handleUnfollow,
    handleShareClick,
    isFollowing,
    profileData,
    descriptionLabel,
    followingLabel,
    followersLabel,
    followLabel,
    unfollowLabel,
    postsLabel,
    editProfileLabel,
    shareProfileLabel,
    changeCoverImageLabel,
    flagAsLabel,
    flaggable,
    onEntryFlag,
    profileProvidersData,
    canUserEdit,
  } = props;

  const postsTitle = `${profileData.totalPosts || 0} ${postsLabel}`;
  const followersTitle = `${profileData.totalFollowers || 0} ${followersLabel}`;
  const followingTitle = `${profileData.totalFollowing || 0} ${followingLabel}`;

  const [editable /* , setEditable */] = useState(false);
  const [menuDropOpen, setMenuDropOpen] = React.useState(false);
  const [editMenuOpen, setEditMenuOpen] = React.useState(false);
  const [avatar, setAvatar] = useState(profileData.avatar);
  const [coverImage, setCoverImage] = useState(profileData.coverImage);
  const [description, setDescription] = useState(profileData.description);
  const [name, setName] = useState(profileData.name);

  const menuIconRef: React.Ref<HTMLDivElement> = React.useRef(null);
  const editMenuRef: React.Ref<HTMLDivElement> = React.useRef(null);

  React.useEffect(() => {
    setAvatar(profileData.avatar);
    setCoverImage(profileData.coverImage);
    setDescription(profileData.description);
    setName(profileData.name);
  }, [profileData]);

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

  const toggleMenuDrop = () => {
    setMenuDropOpen(!menuDropOpen);
  };

  const toggleEditMenu = () => {
    setEditMenuOpen(!editMenuOpen);
  };

  const closeMenuDrop = () => {
    setMenuDropOpen(false);
  };

  const closeEditMenu = () => {
    setEditMenuOpen(false);
  };

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
        editable={editable}
        canUserEdit={canUserEdit}
        coverImage={coverImage}
        coverImageIcon={coverImageIcon}
        handleChangeCoverImage={handleChangeCoverImage}
        coverImagePopoverOpen={coverImagePopoverOpen}
        setCoverImagePopoverOpen={setCoverImagePopoverOpen}
        handleShareClick={handleShareClick}
        profileProvidersData={profileProvidersData}
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
                name={name || truncateMiddle(profileData.ethAddress)}
                nameIcon={nameIcon}
                handleChangeName={handleChangeName}
                namePopoverOpen={namePopoverOpen}
                setNamePopoverOpen={setNamePopoverOpen}
                profileProvidersData={profileProvidersData}
              />

              <Box direction="row" gap="xsmall">
                <Text size="medium" color="secondaryText">
                  {profileData.userName ? `@${profileData.userName.replace('@', '')}` : null}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box direction="row" align="center" gap="small" flex={{ shrink: 0 }}>
            {!canUserEdit && loggedEthAddress && loggedEthAddress !== profileData.ethAddress && (
              <DuplexButton
                icon={<Icon type="following" />}
                active={isFollowing}
                activeLabel={followingLabel}
                inactiveLabel={followLabel}
                activeHoverLabel={unfollowLabel}
                onClickActive={handleUnfollow}
                onClickInactive={handleFollow}
              />
            )}
            {canUserEdit && (
              <EditButton
                primary={true}
                icon={<Icon type="editSimple" ref={editMenuRef} />}
                label={editProfileLabel}
                onClick={toggleEditMenu}
              />
            )}
            {/* if more options need to be in the dropdown, consider adjusting these conditions */}
            {flaggable && !!flagAsLabel?.length && loggedEthAddress !== profileData.ethAddress && (
              <Icon type="moreDark" onClick={toggleMenuDrop} clickable={true} ref={menuIconRef} />
            )}
          </Box>
        </Box>
        {menuIconRef.current && menuDropOpen && (
          <CardHeaderMenuDropdown
            target={menuIconRef.current}
            onMenuClose={closeMenuDrop}
            onFlag={onEntryFlag}
            flagAsLabel={flagAsLabel}
          />
        )}
        <Box pad={{ vertical: 'medium' }} direction="row" alignContent="center" gap="medium">
          <TextIcon
            iconType="quote"
            iconBackground={true}
            iconSize="xxs"
            label={postsTitle}
            onClick={onClickPosts}
            fadedText={true}
            data-testid="posts-button"
          />
          <TextIcon
            iconType="following"
            iconBackground={true}
            iconSize="xxs"
            label={followersTitle}
            onClick={onClickFollowers}
            fadedText={true}
            data-testid="followers-button"
          />
          <TextIcon
            iconType="following"
            iconBackground={true}
            iconSize="xxs"
            label={followingTitle}
            onClick={onClickFollowing}
            fadedText={true}
            data-testid="following-button"
          />
        </Box>
      </Box>
      {editMenuOpen && editMenuRef.current && (
        <ProfileEditMenuDropdown
          target={editMenuRef.current}
          onClose={closeEditMenu}
          onUpdateClick={() => {
            props.onUpdateClick();
            closeEditMenu();
          }}
          onENSChangeClick={() => {
            props.onENSChangeClick();
            closeEditMenu();
          }}
          changeENSLabel={props.changeENSLabel}
          updateProfileLabel={props.updateProfileLabel}
          hideENSButton={props.hideENSButton}
        />
      )}

      <ProfileCardEthereumId profileData={profileData} />
      {description && (
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
// tslint:disable:cyclomatic-complexity
/* eslint-disable complexity */
export default ProfileCard;
