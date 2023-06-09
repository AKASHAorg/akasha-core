import React from 'react';
import Engagements, { EngagementsProps } from './index';

export default {
  title: 'Profile/Engagements',
  component: Engagements,
};

const Template = (args: EngagementsProps) => <Engagements {...args} />;

const COMMON_PROPS = {
  engagementType: 'followers',
  followLabel: 'Follow',
  unFollowLabel: 'Unfollow',
  followingLabel: 'Following',
  profileAnchorLink: '#',
  onError: () => ({}),
  onProfileClick: () => ({}),
  onFollow: () => ({}),
  onUnfollow: () => ({}),
  onChange: () => ({}),
};

const followerData = {
  name: 'Coffee Lover',
  userName: 'ilovecoffee',
  avatar: { default: 'https://placebeard.it/360x360' },
  did: { id: 'did:key:73FaD4201494x0rt17B9892i9fae4d52fe3BD377' },
};

const followingData = {
  name: 'Latte Lover',
  userName: 'ilovelatte',
  avatar: { default: 'https://placebeard.it/360x360' },
  did: { id: 'did:key:73FaD4201494x0rt17B9892i9fae4d52fe3BD377' },
};

export const BaseEngagements = Template.bind({});
BaseEngagements.args = {
  ...COMMON_PROPS,
  followers: {
    label: 'Followers',
    status: 'success',
    data: [{ isFollowing: false, profile: followerData }],
  },
  following: {
    label: 'Following',
    status: 'success',
    data: [{ profile: followingData, isFollowing: true }],
  },
};

export const NoFollowers = Template.bind({});
NoFollowers.args = {
  ...COMMON_PROPS,
  followers: {
    label: 'Followers',
    status: 'success',
    data: [],
  },
  following: {
    label: 'Following',
    status: 'success',
    data: [{ profile: followingData, isFollowing: true }],
  },
};

export const NoFollowing = Template.bind({});
NoFollowing.args = {
  ...COMMON_PROPS,
  followers: {
    label: 'Followers',
    status: 'success',
    data: [{ isFollowing: true, profile: followerData }],
  },
  following: {
    label: 'Following',
    status: 'success',
    data: [],
  },
};

export const OtherViewerNoFollowing = Template.bind({});
OtherViewerNoFollowing.args = {
  ...COMMON_PROPS,
  followers: {
    label: 'Followers',
    status: 'success',
    data: [{ isFollowing: false, profile: followerData }],
  },
  following: {
    label: 'Following',
    status: 'success',
    data: [],
  },
  viewerIsOwner: false,
  ownerUserName: 'espressolover',
};

export const LoadingEngagements = Template.bind({});
LoadingEngagements.args = {
  ...COMMON_PROPS,
  followers: { label: 'Follow', status: 'loading', data: [] },
  following: { label: 'Following', status: 'loading', data: [] },
};

export const ErrorEngagements = Template.bind({});
ErrorEngagements.args = {
  ...COMMON_PROPS,
  followers: { label: 'Follow', status: 'error', data: [] },
  following: { label: 'Following', status: 'error', data: [] },
};
