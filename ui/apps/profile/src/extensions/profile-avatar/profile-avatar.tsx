import React from 'react';
import ProfileAvatarButton, {
  ProfileAvatarButtonProps,
} from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import ProfileAvatarLoading from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton/ProfileAvatarLoading';
import { hasOwn, transformSource } from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

export type ProfileAvatarProps = Pick<
  ProfileAvatarButtonProps,
  'truncateText' | 'href' | 'metadata' | 'customStyle' | 'onClick'
> & { profileDID: string };

const ProfileAvatar = (props: ProfileAvatarProps) => {
  const { profileDID, ...rest } = props;
  const { data, loading, error } = useGetProfileByDidQuery({
    variables: { id: profileDID },
    fetchPolicy: 'cache-first',
  });

  if (loading) return <ProfileAvatarLoading />;

  const profileData = data?.node && hasOwn(data.node, 'isViewer') ? data.node.akashaProfile : null;

  return (
    <ProfileAvatarButton
      profileId={profileDID}
      label={!error && profileData ? profileData.name : profileDID}
      avatar={transformSource(profileData?.avatar?.default)}
      alternativeAvatars={profileData?.avatar?.alternatives?.map(alternative =>
        transformSource(alternative),
      )}
      {...rest}
    />
  );
};

export default ProfileAvatar;
