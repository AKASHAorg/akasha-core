import React, { ReactElement } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import type { Image, Profile } from '@akashaorg/typings/lib/ui';

export type EntryProps = {
  profileAnchorLink: string;
  profileIds: { did: string; id: string };
  avatar: Profile['avatar'];
  name: string;
  followId: string;
  isFollowing: boolean;
  customStyle?: string;
  renderFollowElement: (
    profileId: string,
    followId: string,
    isFollowing: boolean,
  ) => ReactElement | null;
  onProfileClick: (profileId: string) => void;
  transformSource: (src: Image) => Image;
};

const Entry: React.FC<EntryProps> = props => {
  const {
    profileAnchorLink,
    profileIds,
    avatar,
    name,
    followId,
    isFollowing,
    customStyle = '',
    renderFollowElement,
    onProfileClick,
    transformSource,
  } = props;

  return (
    <Stack
      direction="row"
      align="center"
      justify="between"
      padding="pb-4"
      customStyle={customStyle}
      fullWidth
    >
      <ProfileAvatarButton
        profileId={profileIds.did}
        avatar={transformSource(avatar?.default)}
        alternativeAvatars={avatar?.alternatives?.map(alternative => transformSource(alternative))}
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
