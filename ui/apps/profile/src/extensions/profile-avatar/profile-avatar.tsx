import React, { ReactElement } from 'react';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import ProfileAvatarLoading from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton/ProfileAvatarLoading';
import { hasOwn, transformSource } from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

export type ProfileAvatarProps = {
  profileDID: string;
  href?: string;
  metadata?: ReactElement;
  truncateText?: boolean;
  customStyle?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const ProfileAvatar = (props: ProfileAvatarProps) => {
  const { profileDID, ...rest } = props;
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
      profileId={profileDID}
      label={profileData.name}
      avatar={transformSource(profileData?.avatar?.default)}
      alternativeAvatars={profileData?.avatar?.alternatives?.map(alternative =>
        transformSource(alternative),
      )}
      {...rest}
    />
  );
};

export default ProfileAvatar;
