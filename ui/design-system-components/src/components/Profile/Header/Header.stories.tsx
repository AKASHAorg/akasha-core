import React from 'react';
import Header, { HeaderProps } from './index';
import { Profile } from '@akashaorg/typings/ui';

export default {
  title: 'Profile/ProfileHeader',
  component: Header,
};

const Template = (args: HeaderProps & Profile) => <Header {...args} />;

const ethAddress = '0x003410490050000320006570034567114572000';

export const BasicProfileHeader = Template.bind({});
BasicProfileHeader.args = {
  id: 'profile-stream-id',
  did: { id: ethAddress },
  coverImage: null,
  avatar: { default: { src: 'https://placebeard.it/360x360', width: 360, height: 360 } },
  name: 'Coffee Lover',
  flagLabel: 'Report',
};

export const BasicProfileHeaderFollowing = Template.bind({});
BasicProfileHeaderFollowing.args = {
  ...BasicProfileHeader.args,
  isFollowing: true,
};

export const BasicProfileHeaderOwnProfile = Template.bind({});
BasicProfileHeaderOwnProfile.args = {
  ...BasicProfileHeader.args,
  viewerIsOwner: true,
};

export const ProfileHeaderWithoutEns = Template.bind({});
ProfileHeaderWithoutEns.args = {
  ...BasicProfileHeader.args,
  ens: null,
};
