import React from 'react';
import Entry from '../Entry';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EmptyEntry from '../Entry/EmptyEntry';
import { tw } from '@twind/core';
import { Engagement, EngagementProps } from '../types';

export type FollowingProps = {
  following: Engagement;
  ownerUserName: string;
  viewerIsOwner: boolean;
} & EngagementProps;

const Following: React.FC<FollowingProps> = ({
  following,
  profileAnchorLink,
  ownerUserName,
  viewerIsOwner,
  getMediaUrl,
  renderFollowElement,
  onProfileClick,
}) => {
  /*TODO: filter items having isFollowing false when calling the hook and not here*/
  const isEmptyEntry =
    following.length === 0 || following.filter(item => item.isFollowing).length === 0;

  if (isEmptyEntry) {
    return (
      <div className={tw('mt-12')}>
        <EmptyEntry type="following" userName={ownerUserName} viewerIsOwner={viewerIsOwner} />
      </div>
    );
  }

  return (
    <Stack direction="column" spacing="gap-y-4">
      {following.map((engagement, index) =>
        engagement.isFollowing ? (
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
            renderFollowElement={viewerIsOwner ? renderFollowElement : null}
            onProfileClick={onProfileClick}
          />
        ) : null,
      )}
    </Stack>
  );
};

export default Following;
