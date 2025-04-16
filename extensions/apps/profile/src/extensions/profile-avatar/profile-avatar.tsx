import React from 'react';

import ProfileAvatarLoading from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton/ProfileAvatarLoading';
import { hasOwn, transformSource } from '@akashaorg/ui-core-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-core-hooks/lib/generated/apollo';

import {
  ProfileAvatarButton,
  ProfileAvatarButtonAvatar,
  ProfileAvatarButtonAvatarFallback,
  ProfileAvatarButtonAvatarImage,
  ProfileDidField,
  ProfileName,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';

export type ProfileAvatarProps = Pick<
  React.ComponentProps<typeof ProfileAvatarButton>,
  'metadata' | 'className' | 'onClick'
> & { profileDID: string };

const ProfileAvatar = (props: ProfileAvatarProps) => {
  const { profileDID, metadata, className, onClick } = props;
  const profileQuery = useGetProfileByDidQuery({
    variables: { id: profileDID },
    fetchPolicy: 'cache-first',
  });

  if (profileQuery?.loading) return <ProfileAvatarLoading />;

  if (profileQuery?.error) return null;

  const profileData =
    profileQuery.data?.node && hasOwn(profileQuery.data.node, 'isViewer')
      ? profileQuery.data.node.akashaProfile
      : null;

  return (
    <ProfileAvatarButton
      profileDID={profileDID}
      metadata={metadata}
      className={className}
      onClick={onClick}
    >
      <ProfileAvatarButtonAvatar>
        <ProfileAvatarButtonAvatarImage
          src={
            transformSource(profileData?.avatar?.default)?.src ||
            profileData?.avatar?.alternatives?.map(alternative => transformSource(alternative))?.[0]
              ?.src
          }
          alt="Profile Avatar"
        />
        <ProfileAvatarButtonAvatarFallback />
      </ProfileAvatarButtonAvatar>
      <ProfileName>{profileData?.name}</ProfileName>
      <ProfileDidField />
    </ProfileAvatarButton>
  );
};

export default ProfileAvatar;
