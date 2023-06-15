import React from 'react';
import Avatar, { IAvatarProps } from '.';

export default {
  title: 'Avatars/Avatar',
  component: Avatar,
};

const ethAddress = '0x003410490050000320006570034567114572000';

const avatar = {
  default: {
    height: 320,
    src: '',
    width: 320,
  },
};

const Template = (args: IAvatarProps) => <Avatar {...args} />;

export const BaseAvatar = Template.bind({});

BaseAvatar.args = {
  ethAddress: ethAddress,
  avatar,
};

export const ActiveAvatar = Template.bind({});

ActiveAvatar.args = {
  ethAddress: ethAddress,
  avatar,
  active: true,
};

export const FadedAvatar = Template.bind({});

FadedAvatar.args = {
  ethAddress: ethAddress,
  avatar,
  faded: true,
};

export const AvatarWithBorderColor = Template.bind({});

AvatarWithBorderColor.args = {
  ethAddress: ethAddress,
  avatar,
  border: 'sm',
  borderColor: 'darkerBlue',
};

export const AvatarWithSpecifiedSize = Template.bind({});

AvatarWithSpecifiedSize.args = {
  ethAddress: ethAddress,
  avatar,
  size: 'xl',
};
