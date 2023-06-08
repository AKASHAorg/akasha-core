import React from 'react';
import Entry from './Entry';
import EntryError from './Entry/EntryError';
import EntryLoading from './placeholders/EntryLoading';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EmptyEntry, { EmptyEntryProps } from './Entry/EmptyEntry';
import { tw } from '@twind/core';
import { EngagementItem, EngagementsProps } from './index';
import { EngagementType } from '@akashaorg/typings/ui';

export const LOADING_LIST_SIZE = 9;

type EngagementProps = {
  engagements: EngagementItem;
  type: EngagementType;
} & Omit<EngagementsProps, 'followers' | 'following'>;

export const Engagement: React.FC<EngagementProps> = ({
  type,
  engagements,
  followLabel,
  followingLabel,
  unFollowLabel,
  profileAnchorLink,
  ownerUserName,
  viewerIsOwner,
  onError,
  onProfileClick,
  onFollow,
  onUnfollow,
}) => {
  const isEmptyEntry = engagements.status === 'success' && engagements.data.length === 0;
  if (isEmptyEntry) {
    let emptyEntryProps: EmptyEntryProps | null = null;
    if (type === 'followers') {
      emptyEntryProps = { type: 'followers' };
    }
    if (type === 'following') {
      emptyEntryProps = {
        type: 'following',
        userName: ownerUserName,
        viewerIsOwner,
      };
    }
    return emptyEntryProps ? (
      <div className={tw('mt-12')}>
        <EmptyEntry {...emptyEntryProps} />
      </div>
    ) : null;
  }
  return (
    <Stack direction="column" spacing="gap-y-4">
      {engagements.status === 'loading' &&
        Array.from({ length: LOADING_LIST_SIZE }).map((_, index) => (
          <EntryLoading key={`stat-list-${index}`} />
        ))}
      {engagements.status === 'error' && (
        <div className={tw('mt-12')}>
          <EntryError onError={onError} />{' '}
        </div>
      )}
      {engagements.status === 'success' &&
        engagements.data.map((engagement, index) => (
          <Entry
            key={`${engagement?.profile.id}-${index}`}
            followLabel={followLabel}
            unFollowLabel={unFollowLabel}
            followingLabel={followingLabel}
            profileAnchorLink={profileAnchorLink}
            profileId={engagement?.profile.id}
            avatar={engagement?.profile.avatar}
            name={engagement?.profile.name}
            isFollowing={engagement.isFollowing}
            onProfileClick={onProfileClick}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
          />
        ))}
    </Stack>
  );
};
