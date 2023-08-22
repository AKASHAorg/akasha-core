import React, { useEffect, useRef } from 'react';
import { tw } from '@twind/core';
import { useIntersection } from 'react-use';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils';

import Entry from '../Entry';
import EmptyEntry from '../Entry/EmptyEntry';
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
  loadMore,
  onLoadMore,
  getMediaUrl,
  renderFollowElement,
  onProfileClick,
}) => {
  const loadMoreRef = useRef(null);
  const intersection = useIntersection(loadMoreRef, {
    threshold: 0,
  });
  /*TODO: filter items having isFollowing false when calling the hook and not here*/
  const isEmptyEntry =
    following.length === 0 || following.filter(item => item.isFollowing).length === 0;

  useEffect(() => {
    if (intersection?.isIntersecting) {
      onLoadMore();
    }
  }, [intersection, onLoadMore]);

  if (isEmptyEntry) {
    return (
      <div className={tw('mt-12')}>
        <EmptyEntry type="following" userName={ownerUserName} viewerIsOwner={viewerIsOwner} />
      </div>
    );
  }

  const borderBottomStyle = `border-b ${getColorClasses(
    {
      light: 'grey8',
      dark: 'grey5',
    },
    'border',
  )}`;

  return (
    <Stack direction="column" spacing="gap-y-4">
      {following.map((engagement, index, engagements) =>
        engagement.isFollowing ? (
          <Box
            key={`${engagement?.profile.id}-${index}`}
            customStyle={index + 1 !== engagements.length ? borderBottomStyle : ''}
          >
            <Entry
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
          </Box>
        ) : null,
      )}
      <Box customStyle="mx-auto" ref={loadMoreRef}>
        {loadMore && <Spinner />}
      </Box>
    </Stack>
  );
};

export default Following;
