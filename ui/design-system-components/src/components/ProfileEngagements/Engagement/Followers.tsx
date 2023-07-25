import React from 'react';
import Entry from '../Entry';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EmptyEntry from '../Entry/EmptyEntry';
import { tw } from '@twind/core';
import { Engagement, EngagementProps } from '../types';

export type FollowersProps = {
  followers: Engagement;
} & EngagementProps;

const Followers: React.FC<FollowersProps> = ({
  followers,
  profileAnchorLink,
  getMediaUrl,
  renderFollowElement,
  onProfileClick,
}) => {
  const isEmptyEntry = followers.length === 0;

  if (isEmptyEntry) {
    return (
      <div className={tw('mt-12')}>
        <EmptyEntry type="followers" />
      </div>
    );
  }

  return (
    <Stack direction="column" spacing="gap-y-4">
      {followers.map((engagement, index) => (
        <Entry
          key={`${engagement?.profile.id}-${index}`}
          profileAnchorLink={profileAnchorLink}
          profileId={engagement?.profile?.did.id}
          profileStreamId={engagement?.profile?.id}
          avatar={engagement?.profile.avatar}
          name={engagement?.profile.name}
          followStreamId={engagement.id}
          isFollowing={engagement.isFollowing}
          getMediaUrl={getMediaUrl}
          renderFollowElement={renderFollowElement}
          onProfileClick={onProfileClick}
        />
      ))}
    </Stack>
  );
};

export default Followers;
