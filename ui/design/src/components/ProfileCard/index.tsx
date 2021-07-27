import { Box, Text } from 'grommet';
import React, { useState } from 'react';
import DuplexButton from '../DuplexButton';
import Icon from '../Icon';
import TextIcon from '../TextIcon';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import {
  ProfileCardAvatar,
  ProfileCardCoverImage,
  ProfileCardDescription,
  ProfileCardName,
  ProfileCardEthereumId,
} from './profile-card-fields/index';
import { IProfileWidgetCard } from './profile-widget-card';
import { LogoSourceType } from '@akashaproject/ui-awf-typings/lib/index';
import ProfileMenuDropdown from './profile-card-menu-dropdown';
import styled from 'styled-components';
import { truncateMiddle } from '../../utils/string-utils';
import { isMobile } from 'react-device-detect';
import MobileListModal from '../MobileListModal';
import {
  IProfileProvider,
  ProfileProviders,
  UsernameTypes,
} from '@akashaproject/ui-awf-typings/lib/profile';
import { StyledDropAlt } from '../EntryCard/styled-entry-box';

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
  // reporting and moderation related labels
  flagAsLabel?: string;
  blockLabel?: string;
  flaggable: boolean;
  onEntryFlag: () => void;
  getProfileProvidersData?: () => void;
  onUpdateClick: () => void;
  onENSChangeClick: () => void;
  handleShareClick: () => void;
  updateProfileLabel?: string;
  changeENSLabel?: string;
  hideENSButton?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  userNameType?: { default?: IProfileProvider; available: UsernameTypes[] };
}

const EditButton = styled(TextIcon)`
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  cursor: pointer;
  border: 1px solid ${props => props.theme.colors.blue};
  padding: 0.625em 0.5em;
  > span {
    color: ${props => props.theme.colors.blue};
  }
  svg * {
    stroke: ${props => props.theme.colors.blue};
  }
  &:hover {
    background: ${props => props.theme.colors.blue};
    > span {
      color: ${props => props.theme.colors.white};
    }
    svg * {
      stroke: ${props => props.theme.colors.white};
    }
  }
`;

const StatIcon = styled(TextIcon)<{ isMobile?: boolean }>`
  ${props => {
    if (props.isMobile) {
      return `
        flex-direction: column;
        align-items: start;
      `;
    }
    return `
      flex-direction: row;
    `;
  }}
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
    profileProvidersData,
    canUserEdit,
  } = props;

  const postsTitle = `${profileData.totalPosts || 0} ${postsLabel}`;
  const followersTitle = `${profileData.totalFollowers || 0} ${followersLabel}`;
  const followingTitle = `${profileData.totalFollowing || 0} ${followingLabel}`;

  const [editable /* , setEditable */] = useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [avatar, setAvatar] = useState(profileData.avatar);
  const [coverImage, setCoverImage] = useState(profileData.coverImage);
  const [description, setDescription] = useState(profileData.description);
  const [name, setName] = useState(profileData.name);

  const menuRef: React.Ref<HTMLDivElement> = React.useRef(null);

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
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
        pad={{ bottom: 'medium' }}
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
            <Box pad={{ vertical: 'xxsmall', left: 'xsmall', right: 'small' }}>
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
            {loggedEthAddress !== profileData.ethAddress && (
              <Box width="7rem">
                <DuplexButton
                  icon={<Icon type="following" />}
                  active={isFollowing}
                  activeLabel={followingLabel}
                  inactiveLabel={followLabel}
                  activeHoverLabel={unfollowLabel}
                  onClickActive={handleUnfollow}
                  onClickInactive={handleFollow}
                />
              </Box>
            )}
            {!isMobile && canUserEdit && (
              <EditButton
                iconType="editSimple"
                ref={menuRef}
                label={editProfileLabel}
                onClick={toggleMenu}
              />
            )}
            {isMobile || (!isMobile && loggedEthAddress !== profileData.ethAddress) ? (
              <Icon type="moreDark" onClick={toggleMenu} clickable={true} ref={menuRef} />
            ) : null}
          </Box>
        </Box>
        <Box pad={{ bottom: 'medium' }} direction="row" alignContent="center" gap="medium">
          <StatIcon
            iconType="quote"
            iconBackground={true}
            iconSize="xxs"
            label={postsTitle}
            onClick={onClickPosts}
            fadedText={true}
            datatestid="posts-button"
            isMobile={isMobile}
          />
          <StatIcon
            iconType="following"
            iconBackground={true}
            iconSize="xxs"
            label={followersTitle}
            onClick={onClickFollowers}
            fadedText={true}
            datatestid="followers-button"
            isMobile={isMobile}
          />
          <StatIcon
            iconType="following"
            iconBackground={true}
            iconSize="xxs"
            label={followingTitle}
            onClick={onClickFollowing}
            fadedText={true}
            datatestid="following-button"
            isMobile={isMobile}
          />
        </Box>
      </Box>
      {!isMobile && menuOpen && menuRef.current && (
        <ProfileMenuDropdown
          target={menuRef.current}
          onClose={closeMenu}
          onBlockClick={() => {
            /* @todo: replace with handler to block account */
            closeMenu();
          }}
          onReportClick={() => {
            props.onEntryFlag();
            closeMenu();
          }}
          onUpdateClick={() => {
            props.onUpdateClick();
            closeMenu();
          }}
          onENSChangeClick={() => {
            props.onENSChangeClick();
            closeMenu();
          }}
          changeENSLabel={props.changeENSLabel}
          updateProfileLabel={props.updateProfileLabel}
          flagAsLabel={props.flagAsLabel}
          blockLabel={props.blockLabel}
          hideENSButton={props.hideENSButton}
          flaggable={props.flaggable}
        />
      )}
      {isMobile && menuOpen && (
        <StyledDropAlt>
          <MobileListModal
            closeModal={closeMenu}
            menuItems={
              props.flaggable
                ? [
                    {
                      label: props.flagAsLabel,
                      icon: 'report',
                      handler: () => {
                        props.onEntryFlag();
                        closeMenu();
                      },
                    },
                  ]
                : [
                    {
                      label: props.updateProfileLabel,
                      handler: () => {
                        props.onUpdateClick();
                        closeMenu();
                      },
                    },
                    {
                      label: props.changeENSLabel,
                      handler: () => {
                        props.onENSChangeClick();
                        closeMenu();
                      },
                    },
                  ]
            }
          />
        </StyledDropAlt>
      )}
      <Box pad={{ top: 'medium', bottom: 'xsmall' }}>
        <ProfileCardEthereumId
          profileData={profileData}
          copiedLabel={props.copiedLabel}
          copyLabel={props.copyLabel}
          ensName={
            props.userNameType?.default?.provider === ProfileProviders.ENS
              ? props.userNameType.default.value
              : undefined
          }
        />
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
      </Box>
    </MainAreaCardBox>
  );
};
// tslint:disable:cyclomatic-complexity
/* eslint-disable complexity */
export default ProfileCard;
