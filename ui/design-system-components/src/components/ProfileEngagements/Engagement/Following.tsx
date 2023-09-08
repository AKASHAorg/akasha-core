import React, { useEffect, useRef } from 'react';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Entry from '../Entry';
import EmptyEntry from '../Entry/EmptyEntry';
import { tw } from '@twind/core';
import { useIntersection } from 'react-use';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils';
import { AkashaFollowing } from '@akashaorg/typings/ui';
import { EngagementProps } from '../types';

export type FollowingProps = {
  following: AkashaFollowing;
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
  const isEmptyEntry = following.length === 0;

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
    <Stack spacing="gap-y-4">
      {following.map((engagement, index, engagements) => (
        <Stack
          direction="row"
          key={`${engagement?.profile.id}-${index}`}
          customStyle={index + 1 !== engagements.length ? borderBottomStyle : ''}
        >
          <Entry
            profileAnchorLink={profileAnchorLink}
            ceramicAccountId={engagement?.profile?.did.id}
            profileId={engagement?.profile?.id}
            avatar={engagement?.profile?.avatar}
            name={engagement?.profile?.name}
            followId={engagement.id}
            isFollowing={engagement.isFollowing}
            getMediaUrl={getMediaUrl}
            renderFollowElement={viewerIsOwner ? renderFollowElement : null}
            onProfileClick={onProfileClick}
          />
        </Stack>
      ))}
      <Stack customStyle="mx-auto" ref={loadMoreRef}>
        {loadMore && <Spinner />}
      </Stack>
    </Stack>
  );
};

export default Following;
