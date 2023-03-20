import React from 'react';
import FollowEntry from '../ProfileCard/FollowEntry';
import EntryError from '../ProfileCard/FollowEntry/EntryError';
import FollowEntryLoading from '../ProfileCard/placeholders/FollowEntryLoading';
import { Stat, ProfileStatProps } from './index';
import { ProfileStatType } from '@akashaorg/typings/ui';

export const LOADING_LIST_SIZE = 9;

type StatListProps = {
  follow: Stat;
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
    <>
      {follow.status === 'loading' &&
        Array.from({ length: LOADING_LIST_SIZE }).map((_, index) => (
          <FollowEntryLoading key={index} />
        ))}
      {follow.status === 'error' && <EntryError onError={onError} />}
      {follow.status === 'success' &&
        follow.data.map(profile => (
          <FollowEntry
            key={profile.contentId}
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
    </>
  );
};
