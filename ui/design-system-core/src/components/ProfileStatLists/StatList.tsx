import React from 'react';
import ListEntry from './Entry';
import EntryError from './Entry/EntryError';
import ListEntryLoading from './placeholders/ListEntryLoading';
import Stack from '../Stack';
import EmptyEntry, { EmptyEntryProps } from './Entry/EmptyEntry';
import { List, ProfileStatProps } from './index';
import { ProfileStatType } from '@akashaorg/typings/ui';
import { tw } from '@twind/core';

export const LOADING_LIST_SIZE = 9;

type StatListProps = {
  follow: List;
  type: ProfileStatType;
} & Omit<ProfileStatProps, ProfileStatType>;

export const StatList: React.FC<StatListProps> = ({
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
          <ListEntryLoading key={`stat-list-${index}`} />
        ))}
      {follow.status === 'error' && (
        <div className={tw('mt-12')}>
          <EntryError onError={onError} />{' '}
        </div>
      )}
      {follow.status === 'success' &&
        follow.data.map((profile, index) => (
          <ListEntry
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
