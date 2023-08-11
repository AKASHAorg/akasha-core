import React from 'react';
import Following, { FollowingProps } from './Following';

export default {
  title: 'Profile/Following',
  component: Following,
};

const Template = (args: FollowingProps) => <Following {...args} />;

const COMMON_PROPS = {
  profileAnchorLink: '#',
  onError: () => ({}),
  onProfileClick: () => ({}),
  getMediaUrl: () => ({}),
  renderFollowElement: () => <></>,
};

const followingData = {
  name: 'Latte Lover',
  userName: 'ilovelatte',
  avatar: { default: 'https://placebeard.it/360x360' },
  did: { id: 'did:key:73FaD4201494x0rt17B9892i9fae4d52fe3BD377' },
};

export const BaseFollowings = Template.bind({});
BaseFollowings.args = {
  ...COMMON_PROPS,
  following: [{ profile: followingData, isFollowing: true }],
};

export const NoFollowing = Template.bind({});
NoFollowing.args = {
  ...COMMON_PROPS,
  following: [],
};

export const OtherViewerNoFollowing = Template.bind({});
OtherViewerNoFollowing.args = {
  ...COMMON_PROPS,
  following: [],
  viewerIsOwner: false,
  ownerUserName: 'espressolover',
};

export const FollowingLoading = Template.bind({});
FollowingLoading.args = {
  ...COMMON_PROPS,
  following: [],
};

export const ErrorFollowing = Template.bind({});
ErrorFollowing.args = {
  ...COMMON_PROPS,
  following: [],
};
