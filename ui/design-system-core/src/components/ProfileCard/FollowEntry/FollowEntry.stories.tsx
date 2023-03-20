import React from 'react';
import FollowEntry, { FollowEntryProps } from './index';

export default {
  title: 'Cards/FollowEntry',
  component: FollowEntry,
};

const ethAddress = '0x003410490050000320006570034567114572000';

const pubKey = '63FaC9201494f0bd17B9892B9fae4d52fe3BD377';

const Template = (args: FollowEntryProps) => <FollowEntry {...args} />;

export const BaseFollowEntry = Template.bind({});
BaseFollowEntry.args = {
  followLabel: 'Follow',
  unfollowLabel: 'Unfollow',
  followingLabel: 'Following',
  profileAnchorLink: '',
  ethAddress,
  pubKey,
  avatar: { url: 'https://placebeard.it/360x360' },
  name: 'Coffee Lover',
  userName: 'ilovecoffee',
  isFollowing: false,
};
