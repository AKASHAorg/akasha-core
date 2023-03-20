import React from 'react';
import ListEntry, { ListEntryProps } from './index';

export default {
  title: 'Cards/ListEntry',
  component: ListEntry,
};

const ethAddress = '0x003410490050000320006570034567114572000';

const pubKey = '63FaC9201494f0bd17B9892B9fae4d52fe3BD377';

const Template = (args: ListEntryProps) => <ListEntry {...args} />;

export const BaseListEntry = Template.bind({});
BaseListEntry.args = {
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
