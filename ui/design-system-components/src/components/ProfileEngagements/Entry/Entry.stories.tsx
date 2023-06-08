import React from 'react';
import Entry, { EntryProps } from './index';

export default {
  title: 'Profile/Entry',
  component: Entry,
};

const profileId = 'did:key:003410490050000320006570034567114572000';

const Template = (args: EntryProps) => <Entry {...args} />;

export const BaseEntry = Template.bind({});
BaseEntry.args = {
  followLabel: 'Follow',
  unfollowLabel: 'Unfollow',
  followingLabel: 'Following',
  profileAnchorLink: '',
  profileId,
  avatar: { url: 'https://placebeard.it/360x360' },
  name: 'Coffee Lover',
  userName: 'ilovecoffee',
  isFollowing: false,
};
