import React from 'react';
import Avatar from '.';
import { IAvatarProps } from '../../interfaces/avatar.interface';

export default {
  title: 'Avatars/Avatar',
  component: Avatar,
};

const ethAddress = '0x003410490050000320006570034567114572000';

const Template = (args: IAvatarProps) => <Avatar {...args} />;

export const BaseAvatar = Template.bind({});

BaseAvatar.args = {
  ethAddress: ethAddress,
  src: { url: 'https://placebeard.it/360x360' },
};

export const ActiveAvatar = Template.bind({});

ActiveAvatar.args = {
  ethAddress: ethAddress,
  src: { url: 'https://placebeard.it/360x360' },
  active: true,
};

export const FadedAvatar = Template.bind({});

FadedAvatar.args = {
  ethAddress: ethAddress,
  src: { url: 'https://placebeard.it/360x360' },
  faded: true,
};

export const AvatarWithBorderColor = Template.bind({});

AvatarWithBorderColor.args = {
  ethAddress: ethAddress,
  src: { url: 'https://placebeard.it/360x360' },
  border: 'sm',
  borderColor: 'darkerBlue',
};

export const AvatarWithSpecifiedSize = Template.bind({});

AvatarWithSpecifiedSize.args = {
  ethAddress: ethAddress,
  src: { url: 'https://placebeard.it/360x360' },
  size: 'xl',
};
