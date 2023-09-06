import React, { ReactElement } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import { Profile } from '@akashaorg/typings/ui';
import { AkashaProfileImageVersions } from '@akashaorg/typings/sdk/graphql-types-new';

export type EntryProps = {
  profileAnchorLink: string;
  profileId: string;
  profileStreamId: string;
  avatar: Profile['avatar'];
  name: string;
  followStreamId: string;
  isFollowing: boolean;
  getMediaUrl: (image?: AkashaProfileImageVersions) => AkashaProfileImageVersions;
  renderFollowElement: (
    profileStreamId: string,
    followStreamId: string,
    isFollowing: boolean,
  ) => ReactElement | null;
  onProfileClick: (profileId: string) => void;
};

const Entry: React.FC<EntryProps> = props => {
  const {
    profileAnchorLink,
    profileId,
    profileStreamId,
    avatar,
    name,
    followStreamId,
    isFollowing,
    getMediaUrl,
    renderFollowElement,
    onProfileClick,
  } = props;

  return (
    <Stack spacing="gap-y-4">
      <Stack align="center" justify="between">
        <Anchor
          href={`${profileAnchorLink}/${profileId}`}
          onClick={event => {
            event.preventDefault();
            onProfileClick(profileId);
          }}
        >
          <ProfileAvatarButton
            profileId={profileId}
            avatarImage={getMediaUrl(avatar)}
            label={name}
          />
        </Anchor>
        {renderFollowElement && renderFollowElement(profileStreamId, followStreamId, isFollowing)}
      </Stack>
    </Stack>
  );
};

export default Entry;
