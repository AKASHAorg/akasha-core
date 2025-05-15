import React from 'react';

import type { Image, Profile } from '@akashaorg/typings/lib/ui';

import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import {
  DuplexButton,
  DuplexButtonActive,
  DuplexButtonHover,
  DuplexButtonInactive,
} from '@akashaorg/ui/lib/akasha-components/duplex-button';
import {
  ProfileAvatarButton,
  ProfileAvatarButtonAvatar,
  ProfileAvatarButtonAvatarFallback,
  ProfileAvatarButtonAvatarImage,
  ProfileDidField,
  ProfileName,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';

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
  transformSource,
  followLabel = 'Follow',
  unfollowLabel = 'Unfollow',
}: ProfileSearchCardProps) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="between" className="py-2">
      <ProfileAvatarButton profileDID={profileData?.did?.id}>
        <ProfileAvatarButtonAvatar>
          <ProfileAvatarButtonAvatarImage
            src={transformSource(profileData?.avatar?.default)?.src}
            alt="Profile Avatar"
          />
          <ProfileAvatarButtonAvatarFallback
            alternativeSrc={profileData?.avatar?.alternatives?.map(
              alternative => transformSource(alternative)?.src,
            )}
          />
        </ProfileAvatarButtonAvatar>
        <ProfileName>{profileData?.name}</ProfileName>
        <ProfileDidField />
      </ProfileAvatarButton>

      {!authenticatedDID && (
        <div>
          <DuplexButton active={isFollowing}>
            <DuplexButtonInactive onClick={handleFollow} variant="outline">
              {followLabel}
            </DuplexButtonInactive>

            <DuplexButtonHover variant="destructive" onClick={handleUnfollow}>
              {unfollowLabel}
            </DuplexButtonHover>

            <DuplexButtonActive variant="outline">{followingLabel}</DuplexButtonActive>
          </DuplexButton>
        </div>
      )}
    </Stack>
  );
};

export default ProfileSearchCard;
