import React from 'react';

import { Profile } from '@akashaorg/typings/ui';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';

export type ProfileSearchCardProps = {
  className?: string;
  handleFollow: (event: React.SyntheticEvent<Element, Event>) => void;
  handleUnfollow: (event: React.SyntheticEvent<Element, Event>) => void;
  isFollowing: boolean;
  profileData: Profile;
  followingLabel: string;
  followersLabel?: string;
  shareProfileLabel?: string;
  followLabel: string;
  unfollowLabel: string;
  descriptionLabel?: string;
  profileAnchorLink?: string;
  onClickProfile?: () => void;
  showPostCount?: boolean;
  isViewer?: boolean;
};

const ProfileSearchCard: React.FC<ProfileSearchCardProps> = props => {
  const {
    handleFollow,
    handleUnfollow,
    isFollowing,
    profileData,
    followingLabel,
    followLabel,
    unfollowLabel,
    isViewer,
    profileAnchorLink,
    onClickProfile,
  } = props;

  return (
    <Stack align="center" justify="between" customStyle={'py-2'}>
      <a
        onClick={e => {
          e.preventDefault();
          return false;
        }}
        href={`${profileAnchorLink}/${profileData.did.id}`}
      >
        <ProfileAvatarButton
          onClick={onClickProfile}
          label={profileData.name}
          size="md"
          avatarImage={profileData.avatar}
          truncateText={false}
          profileId={profileData.did.id}
        />
      </a>
      {!isViewer && (
        <div>
          <DuplexButton
            inactiveLabel={followLabel}
            activeLabel={followingLabel}
            activeHoverLabel={unfollowLabel}
            onClickInactive={() => handleFollow}
            onClickActive={() => handleUnfollow}
            active={isFollowing}
            allowMinimization={false}
          />
        </div>
      )}
    </Stack>
  );
};

ProfileSearchCard.defaultProps = {
  followLabel: 'Follow',
  unfollowLabel: 'Unfollow',
  followersLabel: 'Followers',
};

export default ProfileSearchCard;
