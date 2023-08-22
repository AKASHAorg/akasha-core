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

export type FollowersProps = {
  followers: Engagement;
  viewerIsOwner: boolean;
} & EngagementProps;

const Followers: React.FC<FollowersProps> = ({
  followers,
  viewerIsOwner,
  profileAnchorLink,
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
  const isEmptyEntry = followers.length === 0;

  useEffect(() => {
    if (intersection?.isIntersecting) {
      onLoadMore();
    }
  }, [intersection, onLoadMore]);

  if (isEmptyEntry) {
    return (
      <div className={tw('mt-12')}>
        <EmptyEntry type="followers" />
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
      {followers.map((engagement, index, engagements) => (
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
      ))}
      <Box customStyle="mx-auto" ref={loadMoreRef}>
        {loadMore && <Spinner />}
      </Box>
    </Stack>
  );
};

export default Followers;
