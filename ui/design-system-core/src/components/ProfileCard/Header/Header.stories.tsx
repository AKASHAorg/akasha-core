import React from 'react';
import Header, { HeaderProps } from './index';

export default {
  title: 'Cards/ProfileHeader',
  component: Header,
};

const Template = (args: HeaderProps) => <Header {...args} />;

const ethAddress = '0x003410490050000320006570034567114572000';

export const BasicProfileHeader = Template.bind({});
BasicProfileHeader.args = {
  ethAddress,
  coverImage: null,
  avatar: { url: 'https://placebeard.it/360x360' },
  name: 'Coffee Lover',
  userName: '@ilovecoffee',
  ensName: 'coffeelover.eth',
};

export const ProfileHeaderWithoutEns = Template.bind({});
ProfileHeaderWithoutEns.args = {
  ethAddress,
  coverImage: null,
  avatar: { url: 'https://placebeard.it/360x360' },
  name: 'Coffee Lover',
  userName: '@ilovecoffee',
};
