import React, { useState } from 'react';
import { Box, Text } from 'grommet';
import styled from 'styled-components';
import { isMobile, isMobileOnly } from 'react-device-detect';

import { IProfileData } from '@akashaorg/typings/ui';

import DuplexButton from '../DuplexButton';
import Icon from '../Icon';
import TextIcon from '../TextIcon';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { ProfileCardAvatar, ProfileCardCoverImage, ProfileCardName } from './profile-card-fields';

import ProfileMenuDropdown from './profile-card-menu-dropdown';
import MobileListModal from '../MobileListModal';

import { truncateMiddle } from '../../utils/string-utils';

export interface IProfileCardProps {
  className?: string;
  showMore: boolean;
  isFollowing?: boolean;
  profileData: IProfileData;
  followingLabel: string;
  followLabel?: string;
  unfollowLabel?: string;
  editProfileLabel?: string;
  shareProfileLabel: string;
  viewerIsOwner?: boolean;
  modalSlotId: string;
  actionButtonExt?: React.ReactNode;
  flaggable: boolean;
  flagAsLabel?: string;
  blockLabel?: string;
  hideENSButton?: boolean;
  onEntryFlag: () => void;
  onUpdateClick: () => void;
  handleShareClick: () => void;
  handleUnfollow?: React.EventHandler<React.SyntheticEvent>;
  handleFollow?: React.EventHandler<React.SyntheticEvent>;
  children?: React.ReactNode;
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

// tslint:disable:cyclomatic-complexity
/* eslint-disable complexity */
const ProfileCard: React.FC<IProfileCardProps> = props => {
  const {
    className,
    showMore,
    isFollowing,
    profileData,
    followingLabel,
    followLabel,
    unfollowLabel,
    editProfileLabel,
    shareProfileLabel,
    viewerIsOwner,
    modalSlotId,
    actionButtonExt,
    flaggable,
    flagAsLabel,
    blockLabel,
    hideENSButton,
    onEntryFlag,
    onUpdateClick,
    handleShareClick,
    handleUnfollow,
    handleFollow,
  } = props;

  const [menuOpen, setMenuOpen] = useState(false);
  const [avatar, setAvatar] = useState(profileData.avatar);
  const [coverImage, setCoverImage] = useState(profileData.coverImage);
  const [name, setName] = useState(profileData.name);

  const menuRef: React.Ref<HTMLDivElement> = React.useRef(null);

  React.useEffect(() => {
    setAvatar(profileData.avatar);
    setCoverImage(profileData.coverImage);
    setName(profileData.name);
  }, [profileData]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <MainAreaCardBox className={className}>
      <ProfileCardCoverImage
        shareProfileLabel={shareProfileLabel}
        coverImage={coverImage}
        onShareClick={handleShareClick}
      />
      <Box direction="column" margin={{ horizontal: 'medium' }}>
        <Box direction="row" justify="between" align="start">
          <Box direction="row">
            <ProfileCardAvatar
              ethAddress={profileData.ethAddress}
              avatar={avatar}
              avatarBorderColor="darkerBlue" // TODO: determine this from the profile data
            />
            <Box pad={{ vertical: 'xxsmall', left: 'xsmall', right: 'small' }}>
              <ProfileCardName name={name || truncateMiddle(profileData.ethAddress)} />
              <Box direction="row" gap="xsmall">
                <Text size="medium" color="secondaryText">
                  {profileData.userName ? `@${profileData.userName.replace('@', '')}` : null}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box
            direction="row"
            align="center"
            gap="small"
            flex={{ shrink: 0 }}
            margin={{ top: 'small' }}
          >
            {!viewerIsOwner && actionButtonExt}
            {!viewerIsOwner && (
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
            {!isMobile && viewerIsOwner && (
              <EditButton iconType="editSimple" label={editProfileLabel} onClick={onUpdateClick} />
            )}
            {showMore && (isMobile || (!isMobile && !viewerIsOwner)) ? (
              <Icon
                type="moreDark"
                plain={true}
                onClick={toggleMenu}
                clickable={true}
                ref={menuRef}
                themeColor="border"
              />
            ) : null}
          </Box>
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
            onEntryFlag();
            closeMenu();
          }}
          flagAsLabel={flagAsLabel}
          blockLabel={blockLabel}
          hideENSButton={hideENSButton}
          flaggable={flaggable}
        />
      )}
      {isMobile && menuOpen && (
        <MobileListModal
          modalSlotId={modalSlotId}
          closeModal={closeMenu}
          menuItems={
            flaggable && [
              {
                label: flagAsLabel,
                icon: 'report',
                handler: () => {
                  onEntryFlag();
                  closeMenu();
                },
              },
            ]
          }
        />
      )}
      {props.children}
    </MainAreaCardBox>
  );
};
export default ProfileCard;
