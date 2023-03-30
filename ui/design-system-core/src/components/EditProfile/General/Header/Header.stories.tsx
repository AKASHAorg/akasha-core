import React from 'react';
import { Header, HeaderProps } from './index';

export default {
  title: 'Profile/EditHeader',
  component: Header,
};

const ethAddress = '0x003410490050000320006570034567114572000';

const Template = (args: HeaderProps) => <Header {...args} />;

export const BaseCoverImage = Template.bind({});
BaseCoverImage.args = {
  ethAddress,
  avatar: { url: 'https://placebeard.it/360x360' },
  label: 'Avatar & Cover Image',
};
