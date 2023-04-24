import React from 'react';
import Engagements, { EngagementsProps } from './index';

export default {
  title: 'Profile/Engagements',
  component: Engagements,
};

const Template = (args: EngagementsProps) => <Engagements {...args} />;

const ethAddress = '0x003410490050000320006570034567114572000';

const pubKey = '63FaC9201494f0bd17B9892B9fae4d52fe3BD377';

const COMMON_PROPS = {
  selectedStat: 'followers',
  pubKeyOfLoggedUser: pubKey,
  followedProfiles: [],
  followLabel: 'Follow',
  unFollowLabel: 'Unfollow',
  followingLabel: 'Following',
  profileAnchorLink: '#',
  loadingMoreLabel: 'Load more ...',
  onError: () => ({}),
  onProfileClick: () => ({}),
  onFollow: () => ({}),
  onUnfollow: () => ({}),
};

const followerData = {
  name: 'Coffee Lover',
  userName: 'ilovecoffee',
  avatar: { url: 'https://placebeard.it/360x360' },
  ethAddress,
  pubKey: '73FaD4201494x0ce17B9892i9fae4d52fe3BD377',
};

const followingData = {
  name: 'Latte Lover',
  userName: 'ilovelatte',
  avatar: { url: 'https://placebeard.it/360x360' },
  ethAddress,
  pubKey: '73FaD4201494x0rt17B9892i9fae4d52fe3BD377',
};

export const BaseEngagements = Template.bind({});
BaseEngagements.args = {
  ...COMMON_PROPS,
  followedProfiles: ['73FaD4201494x0rt17B9892i9fae4d52fe3BD377'],
  followers: {
    label: 'Followers',
    status: 'success',
    data: [followerData],
    hasNextPage: false,
  },
  following: {
    label: 'Following',
    status: 'success',
    data: [followingData],
    hasNextPage: false,
  },
};

export const NoFollowers = Template.bind({});
NoFollowers.args = {
  ...COMMON_PROPS,
  followedProfiles: ['73FaD4201494x0rt17B9892i9fae4d52fe3BD377'],
  followers: {
    label: 'Followers',
    status: 'success',
    data: [],
    hasNextPage: false,
  },
  following: {
    label: 'Following',
    status: 'success',
    data: [followingData],
    hasNextPage: false,
  },
};

export const NoFollowing = Template.bind({});
NoFollowing.args = {
  ...COMMON_PROPS,
  followedProfiles: ['73FaD4201494x0rt17B9892i9fae4d52fe3BD377'],
  followers: {
    label: 'Followers',
    status: 'success',
    data: [followerData],
    hasNextPage: false,
  },
  following: {
    label: 'Following',
    status: 'success',
    data: [],
    hasNextPage: false,
  },
};

export const OtherViewerNoFollowing = Template.bind({});
OtherViewerNoFollowing.args = {
  ...COMMON_PROPS,
  followedProfiles: ['73FaD4201494x0rt17B9892i9fae4d52fe3BD377'],
  followers: {
    label: 'Followers',
    status: 'success',
    data: [followerData],
    hasNextPage: false,
  },
  following: {
    label: 'Following',
    status: 'success',
    data: [],
    hasNextPage: false,
  },
  viewerIsOwner: false,
  ownerUserName: 'espressolover',
};

export const LoadingEngagements = Template.bind({});
LoadingEngagements.args = {
  ...COMMON_PROPS,
  followers: { label: 'Follow', status: 'loading', data: [], hasNextPage: false },
  following: { label: 'Following', status: 'loading', data: [], hasNextPage: false },
};

export const ErrorEngagements = Template.bind({});
ErrorEngagements.args = {
  ...COMMON_PROPS,
  followers: { label: 'Follow', status: 'error', data: [], hasNextPage: false },
  following: { label: 'Following', status: 'error', data: [], hasNextPage: false },
};
