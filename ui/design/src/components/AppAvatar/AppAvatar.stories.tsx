import React from 'react';
import { Grommet } from 'grommet';

import AppAvatar, { AppAvatarProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Avatars/AppAvatar',
  component: AppAvatar,
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: { action: 'clicked' },
  },
};

const ethAddress = '0x003410490050000320006570034567114572000';

const Template = (args: AppAvatarProps) => (
  <Grommet theme={lightTheme}>
    <AppAvatar {...args} />
  </Grommet>
);

export const BaseAvatar = Template.bind({});
BaseAvatar.args = {
  ethAddress: ethAddress,
  src: 'https://placebeard.it/360x360',
};

export const AvatarWithAppPlaceholder = Template.bind({});
AvatarWithAppPlaceholder.args = {
  sidebarApp: true,
};

export const AvatarWithWidgetPlaceholder = Template.bind({});
AvatarWithWidgetPlaceholder.args = {
  sidebarWidget: true,
};
