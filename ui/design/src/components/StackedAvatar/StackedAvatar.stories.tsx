import React from 'react';
import { Grommet } from 'grommet';

import StackedAvatar, { IStackedAvatarProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import { userData } from '../../utils/dummy-data';

export default {
  title: 'Avatars/StackedAvatar',
  component: StackedAvatar,
};

const Template = (args: IStackedAvatarProps) => (
  <Grommet theme={lightTheme}>
    <StackedAvatar {...args} />
  </Grommet>
);

export const BaseStackedAvatar = Template.bind({});

BaseStackedAvatar.args = {
  userData: userData,
  maxAvatars: 3, // slices this number from user data and renders the corresponding avatars
};
