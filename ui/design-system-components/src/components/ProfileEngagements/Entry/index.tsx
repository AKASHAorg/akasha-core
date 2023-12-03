import React, { ReactElement } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import { Profile } from '@akashaorg/typings/lib/ui';
import { AkashaProfileImageVersions } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export type EntryProps = {
  profileAnchorLink: string;
  profileIds: { did: string; id: string };
  avatar: Profile['avatar'];
  name: string;
  followId: string;
  isFollowing: boolean;
  getMediaUrl: (image?: AkashaProfileImageVersions) => AkashaProfileImageVersions;
  renderFollowElement: (
    profileId: string,
    followId: string,
    isFollowing: boolean,
  ) => ReactElement | null;
  onProfileClick: (profileId: string) => void;
};

const Entry: React.FC<EntryProps> = props => {
  const {
    profileAnchorLink,
    profileIds,
    avatar,
    name,
    followId,
    isFollowing,
    getMediaUrl,
    renderFollowElement,
    onProfileClick,
  } = props;

  return (
    <Stack direction="row" align="center" justify="between" customStyle="pb-4" fullWidth>
      <ProfileAvatarButton
        profileId={profileIds.did}
        avatarImage={getMediaUrl(avatar)}
        label={name}
        href={`${profileAnchorLink}/${profileIds.did}`}
        onClick={() => {
          onProfileClick(profileIds.did);
        }}
      />
      {renderFollowElement && renderFollowElement(profileIds.id, followId, isFollowing)}
    </Stack>
  );
};

export default Entry;
