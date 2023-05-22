import React from 'react';
import { IProfileData } from '@akashaorg/typings/ui';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';

export interface IProfileSearchCard {
  className?: string;
  loggedEthAddress: string;
  handleFollow: (event: React.SyntheticEvent<Element, Event>) => void;
  handleUnfollow: (event: React.SyntheticEvent<Element, Event>) => void;
  isFollowing: boolean;
  profileData: IProfileData;
  followingLabel: string;
  followersLabel?: string;
  shareProfileLabel?: string;
  followLabel: string;
  unfollowLabel: string;
  beamsLabel: string;
  descriptionLabel?: string;
  profileAnchorLink?: string;
  onClickProfile?: () => void;
  showPostCount?: boolean;
}

const ProfileSearchCard: React.FC<IProfileSearchCard> = props => {
  const {
    loggedEthAddress,
    handleFollow,
    handleUnfollow,
    isFollowing,
    profileData,
    followingLabel,
    followLabel,
    unfollowLabel,
    profileAnchorLink,
    onClickProfile,
  } = props;

  const BaseItemStyles = `
  flex justify-between items-center py-2
  `;

  return (
    <Box customStyle={BaseItemStyles}>
      <a
        onClick={e => {
          e.preventDefault();
          return false;
        }}
        href={`${profileAnchorLink}/${profileData.pubKey}`}
      >
        <ProfileAvatarButton
          ethAddress={profileData.ethAddress}
          onClick={onClickProfile}
          label={profileData.name}
          info={profileData.userName}
          size="md"
          avatarImage={profileData.avatar}
          truncateText={false}
        />
      </a>
      {profileData.ethAddress !== loggedEthAddress && (
        <div>
          <DuplexButton
            inactiveLabel={followLabel}
            activeLabel={unfollowLabel}
            onClickInactive={() => handleFollow}
            onClickActive={() => handleUnfollow}
            active={isFollowing}
            allowMinimization={false}
          />
        </div>
      )}
    </Box>
  );
};

ProfileSearchCard.defaultProps = {
  followLabel: 'Follow',
  unfollowLabel: 'Unfollow',
  followersLabel: 'Followers',
};

export default ProfileSearchCard;
