import React from 'react';
import EmptyEntry, { EmptyEntryProps } from '.';

export default {
  title: 'Profile/EmptyEntry',
  component: EmptyEntry,
};

const Template = (args: EmptyEntryProps) => <EmptyEntry {...args} />;

export const FollowersEmptyEntry = Template.bind({});
FollowersEmptyEntry.args = {
  viewerIsOwner: false,
};

export const FollowingEmptyEntry = Template.bind({});
FollowingEmptyEntry.args = {
  type: 'following',
};

export const OtherViewerFollowingEmptyEntry = Template.bind({});
OtherViewerFollowingEmptyEntry.args = {
  type: 'following',
  viewerIsOwner: false,
};
