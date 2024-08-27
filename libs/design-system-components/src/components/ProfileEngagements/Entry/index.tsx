import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import type { Profile } from '@akashaorg/typings/lib/ui';
import type { EngagementProp } from '../types';

export type EntryProps = {
  profileIds: { did: string; id: string };
  avatar: Profile['avatar'];
  name: string;
  customStyle?: string;
} & Omit<EngagementProp, 'authenticatedDID' | 'onLoadMore'>;

const Entry: React.FC<EntryProps> = props => {
  const {
    profileAnchorLink,
    profileIds,
    avatar,
    name,
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
      {renderFollowElement?.(profileIds.id)}
    </Stack>
  );
};

export default Entry;
