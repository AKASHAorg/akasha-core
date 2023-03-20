import React from 'react';
import ListEntry from './Entry';
import EntryError from './Entry/EntryError';
import ListEntryLoading from './placeholders/ListEntryLoading';
import Stack from '../Stack';
import { List, ProfileStatProps } from './index';
import { ProfileStatType } from '@akashaorg/typings/ui';

export const LOADING_LIST_SIZE = 9;

type StatListProps = {
  follow: List;
} & Omit<ProfileStatProps, ProfileStatType>;

export const StatList: React.FC<StatListProps> = ({
  pubKeyOfLoggedUser,
  followedProfiles,
  follow,
  followLabel,
  followingLabel,
  unFollowLabel,
  profileAnchorLink,
  loadingMoreLabel,
  onError,
  onProfileClick,
  onFollow,
  onUnfollow,
}) => {
  return (
    <Stack direction="column" spacing="gap-y-4">
      {follow.status === 'loading' &&
        Array.from({ length: LOADING_LIST_SIZE }).map((_, index) => (
          <ListEntryLoading key={`stat-list-${index}`} />
        ))}
      {follow.status === 'error' && <EntryError onError={onError} />}
      {follow.status === 'success' &&
        follow.data.map((profile, index) => (
          <ListEntry
            key={`${profile.userName}-${index}`}
            followLabel={followLabel}
            unFollowLabel={unFollowLabel}
            followingLabel={followingLabel}
            profileAnchorLink={profileAnchorLink}
            ethAddress={profile.ethAddress}
            pubKey={profile.pubKey}
            avatar={profile.avatar}
            name={profile.name}
            userName={profile.userName}
            isFollowing={followedProfiles.includes(profile.pubKey)}
            pubKeyOfLoggedUser={pubKeyOfLoggedUser}
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
