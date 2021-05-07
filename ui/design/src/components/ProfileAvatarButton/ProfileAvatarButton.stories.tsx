import React from 'react';
import { Grommet } from 'grommet';

import ProfileAvatarButton from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Buttons/ProfileAvatarButton',
  component: ProfileAvatarButton,
  argTypes: {
    label: { control: 'text' },
  },
};

const Template = (args: any) => (
  <Grommet theme={lightTheme}>
    <ProfileAvatarButton {...args} />
  </Grommet>
);

export const BaseProfileAvatarButton = Template.bind({});
BaseProfileAvatarButton.args = {
  ethAddress: '0x000000',
  avatarImage: 'https://placebeard.it/360x360',
  label: 'AKASHA World',
  info: '20 April 2021 | 15h30',
  size: 'lg',
};
