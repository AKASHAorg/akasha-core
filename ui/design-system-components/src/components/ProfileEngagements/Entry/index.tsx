import React, { ReactElement } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import { Profile } from '@akashaorg/typings/lib/ui';
import { AkashaProfileImageVersions } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export type EntryProps = {
  profileAnchorLink: string;
  accountId: string;
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
    accountId,
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
        href={`${profileAnchorLink}/${accountId}`}
        onClick={event => {
          event.preventDefault();
          onProfileClick(accountId);
        }}
      >
        <ProfileAvatarButton profileId={profileId} avatarImage={getMediaUrl(avatar)} label={name} />
      </Anchor>
      {renderFollowElement && renderFollowElement(profileId, followId, isFollowing)}
    </Stack>
  );
};

export default Entry;
