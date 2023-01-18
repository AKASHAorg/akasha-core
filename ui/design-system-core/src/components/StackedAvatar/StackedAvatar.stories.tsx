import React from 'react';

import StackedAvatar from '.';

import { IStackedAvatarProps } from '../../interfaces/stackedAvatar.interface';
import { userData } from '../../utils/dummy-data';

export default {
  title: 'Avatars/StackedAvatar',
  component: StackedAvatar,
};

const Template = (args: IStackedAvatarProps) => <StackedAvatar {...args} />;

export const BaseStackedAvatar = Template.bind({});

BaseStackedAvatar.args = {
  userData: userData,
  maxAvatars: 4, // slices this number from user data and renders the corresponding avatars
};

export const StackedAvatarWithSpecifiedSize = Template.bind({});

StackedAvatarWithSpecifiedSize.args = {
  userData: userData,
  maxAvatars: 4,
  size: 'xl',
};
