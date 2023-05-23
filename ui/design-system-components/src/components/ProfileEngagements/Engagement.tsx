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
  follow: EngagementItem;
  type: EngagementType;
} & Omit<EngagementsProps, 'followers' | 'following'>;

export const Engagement: React.FC<EngagementProps> = ({
  type,
  loggedProfileId,
  followedProfiles,
  follow,
  followLabel,
  followingLabel,
  unFollowLabel,
  profileAnchorLink,
  loadingMoreLabel,
  ownerUserName,
  viewerIsOwner,
  onError,
  onProfileClick,
  onFollow,
  onUnfollow,
}) => {
  const isEmptyEntry = follow.status === 'success' && follow.data?.length === 0;
  if (isEmptyEntry) {
    let emptyEntryProps: EmptyEntryProps | null = null;
    if (type === 'followers') {
      emptyEntryProps = { type: 'followers' };
    }
    if (type === 'following') {
      emptyEntryProps = {
        type: 'following',
        userName: ownerUserName,
        viewerIsOwner: viewerIsOwner,
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
      {follow.status === 'loading' &&
        Array.from({ length: LOADING_LIST_SIZE }).map((_, index) => (
          <EntryLoading key={`stat-list-${index}`} />
        ))}
      {follow.status === 'error' && (
        <div className={tw('mt-12')}>
          <EntryError onError={onError} />{' '}
        </div>
      )}
      {follow.status === 'success' &&
        follow.data.map((profile, index) => (
          <Entry
            key={`${profile.did.id}-${index}`}
            followLabel={followLabel}
            unFollowLabel={unFollowLabel}
            followingLabel={followingLabel}
            profileAnchorLink={profileAnchorLink}
            profileId={profile.did.id}
            avatar={profile.avatar}
            name={profile.name}
            isFollowing={followedProfiles.includes(profile.did.id)}
            loggedProfileId={loggedProfileId}
            hasNextPage={follow.hasNextPage}
            loadingMoreLabel={loadingMoreLabel}
            onLoadMore={follow.onLoadMore}
            onProfileClick={onProfileClick}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
          />
        ))}
    </Stack>
  );
};
