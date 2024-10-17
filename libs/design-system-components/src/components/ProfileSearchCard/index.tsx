import React from 'react';

import type { Image, Profile } from '@akashaorg/typings/lib/ui';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';

export type ProfileSearchCardProps = {
  isFollowing: boolean;
  profileData: Profile;
  followingLabel: string;
  followersLabel?: string;
  shareProfileLabel?: string;
  followLabel: string;
  unfollowLabel: string;
  descriptionLabel?: string;
  showPostCount?: boolean;
  authenticatedDID?: boolean;
  transformSource: (src: Image) => Image;
  onClickProfile?: () => void;
  handleFollow: (event: React.SyntheticEvent<Element, Event>) => void;
  handleUnfollow: (event: React.SyntheticEvent<Element, Event>) => void;
};

/**
 * Component used in the search app to display user profiles
 * @param isFollowing - whether the logged in user is following this profile
 * @param profileData - data for this profile
 * @param followingLabel - text for number of users that this profile is following
 * @param followersLabel - text for number of users following this profile
 * @param shareProfileLabel - text for sharing profile
 * @param followLabel - text for follow button
 * @param unfollowLabel - text for unfollow button
 * @param descriptionLabel - title for profile description section
 * @param showPostCount - whether to display the number of beams posted by this profile
 * @param authenticatedDID - DID of logged in user
 * @param transformSource - utility function to provide a gateway for ipfs images
 * @param onClickProfile - handler for clicking on the profile, redirects to profile page
 * @param handleFollow - handler for following this profile
 * @param handleUnfollow - handler for unfollowing this profile
 */
const ProfileSearchCard = ({
  handleFollow,
  handleUnfollow,
  isFollowing,
  profileData,
  followingLabel,
  authenticatedDID,
  onClickProfile,
  transformSource,
  followLabel = 'Follow',
  unfollowLabel = 'Unfollow',
}: ProfileSearchCardProps) => {
  return (
    <Stack direction="row" align="center" justify="between" customStyle={'py-2'}>
      <ProfileAvatarButton
        onClick={onClickProfile}
        label={profileData?.name}
        avatar={transformSource(profileData?.avatar?.default)}
        alternativeAvatars={profileData?.avatar?.alternatives?.map(alternative =>
          transformSource(alternative),
        )}
        truncateText={false}
        profileId={profileData?.did?.id}
      />

      {!authenticatedDID && (
        <div>
          <DuplexButton
            inactiveLabel={followLabel}
            activeLabel={followingLabel}
            activeHoverLabel={unfollowLabel}
            onClickInactive={() => handleFollow}
            onClickActive={() => handleUnfollow}
            active={isFollowing}
          />
        </div>
      )}
    </Stack>
  );
};

export default ProfileSearchCard;
