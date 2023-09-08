import React, { ReactElement } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import { Profile } from '@akashaorg/typings/ui';
import { AkashaProfileImageVersions } from '@akashaorg/typings/sdk/graphql-types-new';

export type EntryProps = {
  profileAnchorLink: string;
  ceramicAccountId: string;
  profileId: string;
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
    ceramicAccountId,
    profileId,
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
      <Anchor
        href={`${profileAnchorLink}/${ceramicAccountId}`}
        onClick={event => {
          event.preventDefault();
          onProfileClick(ceramicAccountId);
        }}
      >
        <ProfileAvatarButton profileId={profileId} avatarImage={getMediaUrl(avatar)} label={name} />
      </Anchor>
      {renderFollowElement && renderFollowElement(profileId, followId, isFollowing)}
    </Stack>
  );
};

export default Entry;
