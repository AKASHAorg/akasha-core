import React from 'react';
import Followers, { FollowersProps } from './Followers';

export default {
  title: 'Profile/Followers',
  component: Followers,
};

const Template = (args: FollowersProps) => <Followers {...args} />;

const COMMON_PROPS = {
  profileAnchorLink: '#',
  onError: () => ({}),
  onProfileClick: () => ({}),
  getMediaUrl: () => ({}),
  onLoadMore: () => ({}),
  renderFollowElement: () => <></>,
};

const followerData = {
  name: 'Coffee Lover',
  userName: 'ilovecoffee',
  avatar: { default: 'https://placebeard.it/360x360' },
  did: { id: 'did:key:73FaD4201494x0rt17B9892i9fae4d52fe3BD377' },
};

export const BaseFollowers = Template.bind({});
BaseFollowers.args = {
  ...COMMON_PROPS,
  followers: [{ isFollowing: false, profile: followerData }],
};

export const NoFollowers = Template.bind({});
NoFollowers.args = {
  ...COMMON_PROPS,
  followers: [],
};

export const OtherViewerNoFollowing = Template.bind({});
OtherViewerNoFollowing.args = {
  ...COMMON_PROPS,
  followers: [{ isFollowing: false, profile: followerData }],
  viewerIsOwner: false,
  ownerUserName: 'espressolover',
};

export const FollowersLoading = Template.bind({});
FollowersLoading.args = {
  ...COMMON_PROPS,
  followers: [],
};

export const FollowersError = Template.bind({});
FollowersError.args = {
  ...COMMON_PROPS,
  followers: [],
};
