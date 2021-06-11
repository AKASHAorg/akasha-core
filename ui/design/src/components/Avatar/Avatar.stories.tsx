import React from 'react';
import { Grommet } from 'grommet';

import Avatar, { AvatarProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Avatars/Avatar',
  component: Avatar,
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: { action: 'clicked' },
  },
};

const ethAddress = '0x003410490050000320006570034567114572000';

const guestEthAddress = '0x00000000000000000000000000000';

const Template = (args: AvatarProps) => (
  <Grommet theme={lightTheme}>
    <Avatar {...args} />
  </Grommet>
);

export const BaseAvatar = Template.bind({});
BaseAvatar.args = {
  ethAddress: ethAddress,
  src: 'https://placebeard.it/360x360',
};

export const AvatarWithMarginAndBackgroundColor = Template.bind({});
AvatarWithMarginAndBackgroundColor.args = {
  ethAddress: ethAddress,
  src: 'https://placebeard.it/360x360',
  margin: { margin: '0px' },
  backgroundColor: '#ffa3e4',
  border: 'sm',
};

export const AvatarWithSpecifiedSize = Template.bind({});
AvatarWithSpecifiedSize.args = {
  ethAddress: ethAddress,
  src: 'https://placebeard.it/360x360',
  margin: { margin: '0px' },
  backgroundColor: '#ffa3e4',
  border: 'sm',
  size: 'xl',
};

export const GuestModeAvatar = Template.bind({});
GuestModeAvatar.args = {
  ethAddress: guestEthAddress,
  border: 'sm',
  size: 'lg',
};

export const AvatarNotSet = Template.bind({});
AvatarNotSet.args = {
  ethAddress: ethAddress,
  border: 'sm',
  size: 'sm',
};
