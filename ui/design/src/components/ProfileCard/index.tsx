import React, { useState } from 'react';
import { Box, Text } from 'grommet';
import styled from 'styled-components';
import { isMobile, isMobileOnly } from 'react-device-detect';

import {
  IProfileData,
  ProfileProviders,
  UsernameTypes,
  LogoSourceType,
} from '@akashaorg/typings/ui';

import DuplexButton from '../DuplexButton';
import Icon, { IconType } from '../Icon';
import TextIcon from '../TextIcon';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import {
  ProfileCardAvatar,
  ProfileCardCoverImage,
  ProfileCardDescription,
  ProfileCardName,
  ProfileCardEthereumId,
  ProfileCardBadges,
} from './profile-card-fields';

import ProfileMenuDropdown from './profile-card-menu-dropdown';
import MobileListModal from '../MobileListModal';
import HorizontalDivider from '../HorizontalDivider';

import { truncateMiddle } from '../../utils/string-utils';

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

export interface IProfileCardProps {
  // edit profile related
  profileProvidersData?: IProfileProvidersData;
  canUserEdit?: boolean;
  // @TODO fix this
  onChangeProfileData?: (newProfileData: IProfileData) => void;
  // determines when to render the 'show more' icon
  className?: string;
  loggedEthAddress?: string | null;
  isFollowing?: boolean;
  showMore: boolean;
  flaggable: boolean;
  hideENSButton?: boolean;
  profileData: IProfileData;
  // labels
  editProfileLabel?: string;
  changeCoverImageLabel?: string;
  cancelLabel?: string;
  saveChangesLabel?: string;
  // reporting and moderation related labels
  flagAsLabel?: string;
  blockLabel?: string;
  descriptionLabel: string;
  badgesLabel: string;
  postsLabel: string;
  interestsLabel?: string;
  followingLabel: string;
  followersLabel: string;
  followLabel?: string;
  unfollowLabel?: string;
  shareProfileLabel: string;
  updateProfileLabel?: string;
  changeENSLabel?: string;
  copyLabel?: string;
  copiedLabel?: string;
  onEntryFlag: () => void;
  getProfileProvidersData?: () => void;
  onUpdateClick: () => void;
  onENSChangeClick: () => void;
  handleShareClick: () => void;
  onClickProfile?: React.EventHandler<React.SyntheticEvent>;
  onClickFollowers?: React.EventHandler<React.SyntheticEvent>;
  onClickFollowing?: React.EventHandler<React.SyntheticEvent>;
  onClickPosts?: React.EventHandler<React.SyntheticEvent>;
  onClickInterests?: React.EventHandler<React.SyntheticEvent>;
  handleUnfollow?: React.EventHandler<React.SyntheticEvent>;
  handleFollow?: React.EventHandler<React.SyntheticEvent>;
  userNameType?: {
    default?: { provider: string; property: string; value: string };
    available: UsernameTypes[];
  };
  modalSlotId: string;
  actionButtonExt?: React.ReactNode;
}

interface IStat {
  iconType: IconType;
  count: string;
  label: string;
  clickHandler: (event: React.SyntheticEvent<Element, Event>) => void;
  dataTestId: string;
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

const StatIconWrapper = styled(Box)<{ isMobile?: boolean }>`
  color: ${props => props.theme.colors.secondaryText};
  &:hover {
    color: ${props => props.theme.colors.accent};
  }
  ${props => {
    if (props.isMobile) {
      return `
        flex-direction: column;
        align-items: start;
      `;
    }
    return `
      flex-direction: row;
        align-items: center;
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
    onClickInterests,
    onClickPosts,
    handleFollow,
    handleUnfollow,
    handleShareClick,
    showMore,
    isFollowing,
    profileData,
    descriptionLabel,
    badgesLabel,
    followingLabel,
    followersLabel,
    followLabel,
    unfollowLabel,
    postsLabel,
    interestsLabel,
    editProfileLabel,
    shareProfileLabel,
    changeCoverImageLabel,
    profileProvidersData,
    canUserEdit,
    modalSlotId,
    actionButtonExt,
  } = props;

  const [editable /* , setEditable */] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatar, setAvatar] = useState(profileData.avatar);
  const [coverImage, setCoverImage] = useState(profileData.coverImage);
  const [description, setDescription] = useState(profileData.description);
  const [name, setName] = useState(profileData.name);
  const [hoveredStatId, setHoveredStatId] = useState<number | null>(null);

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
    setAvatar({ url: provider.value });
    setAvatarIcon(provider.providerIcon);
    setAvatarPopoverOpen(false);
  };

  const handleChangeCoverImage = (provider: IProfileDataProvider) => {
    setCoverImage({ url: provider.value });
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

  const handleStatHover = (id?: number) => () => {
    if (typeof id === 'undefined') {
      return setHoveredStatId(null);
    }
    return setHoveredStatId(id);
  };

  const stats: IStat[] = [
    {
      iconType: 'quote',
      count: `${profileData.totalPosts || 0}`,
      label: postsLabel,
      clickHandler: onClickPosts,
      dataTestId: 'posts-button',
    },
    {
      iconType: 'follower',
      count: `${profileData.totalFollowers || 0}`,
      label: followersLabel,
      clickHandler: onClickFollowers,
      dataTestId: 'followers-button',
    },
    {
      iconType: 'following',
      count: `${profileData.totalFollowing || 0}`,
      label: followingLabel,
      clickHandler: onClickFollowing,
      dataTestId: 'following-button',
    },
    {
      iconType: 'hashtagGray',
      count: `${profileData.totalInterests || 0}`,
      label: interestsLabel,
      clickHandler: onClickInterests,
      dataTestId: 'interests-button',
    },
  ];

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
              avatarBorderColor="darkerBlue" // TODO: determine this from the profile data
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
            {loggedEthAddress !== profileData.ethAddress && actionButtonExt}
            {loggedEthAddress !== profileData.ethAddress && (
              <Box data-testid="profile-card-follow-button">
                <DuplexButton
                  icon={<Icon type="following" />}
                  active={isFollowing}
                  activeLabel={!isMobileOnly ? followingLabel : ''}
                  inactiveLabel={!isMobileOnly ? followLabel : ''}
                  activeHoverLabel={!isMobileOnly ? unfollowLabel : ''}
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
            {showMore &&
            (isMobile || (!isMobile && loggedEthAddress !== profileData.ethAddress)) ? (
              <Icon
                type="moreDark"
                plain={true}
                onClick={toggleMenu}
                clickable={true}
                ref={menuRef}
              />
            ) : null}
          </Box>
        </Box>
        <Box
          pad={{ bottom: 'small' }}
          direction="row"
          alignContent="center"
          gap="medium"
          justify={isMobileOnly ? 'between' : 'start'}
        >
          {stats.map((stat, id) => (
            <StatIconWrapper
              key={stat.label + id}
              isMobile={isMobileOnly}
              onClick={stat.clickHandler}
              onMouseEnter={handleStatHover(id)}
              onMouseLeave={handleStatHover()}
            >
              <TextIcon
                iconType={stat.iconType}
                iconBackground={true}
                iconSize="xxs"
                label={stat.count}
                datatestid={stat.dataTestId}
                clickable={true}
                accentColor={hoveredStatId === id}
              />
              <Text
                margin={{
                  ...(isMobileOnly && { top: 'xxsmall' }),
                  ...(!isMobileOnly && { left: 'xxsmall' }),
                }}
              >
                {stat.label}
              </Text>
            </StatIconWrapper>
          ))}
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
        <MobileListModal
          modalSlotId={modalSlotId}
          closeModal={closeMenu}
          menuItems={
            props.flaggable
              ? [
                  // {
                  //   label: props.blockLabel,
                  //   icon: 'block',
                  //   handler: () => {
                  //     /* @todo: replace with handler to block account */
                  //     closeMenu();
                  //   },
                  // },
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
          <>
            <Box pad={{ horizontal: 'medium' }}>
              <HorizontalDivider />
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
          </>
        )}
      </Box>
      {profileData.badges?.length > 0 && (
        <>
          <Box pad={{ horizontal: 'medium' }}>
            <HorizontalDivider />
          </Box>
          <ProfileCardBadges badgesLabel={badgesLabel} badges={profileData.badges} />
        </>
      )}
    </MainAreaCardBox>
  );
};
// tslint:disable:cyclomatic-complexity
/* eslint-disable complexity */
export default ProfileCard;
