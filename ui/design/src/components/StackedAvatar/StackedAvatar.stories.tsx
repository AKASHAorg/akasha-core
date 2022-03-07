import React from 'react';
import { Grommet } from 'grommet';
import { withDesign } from 'storybook-addon-designs';
import StackedAvatar, { IStackedAvatarProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import { userData } from '../../utils/dummy-data';

export default {
  title: 'Avatars/StackedAvatar',
  component: StackedAvatar,
  decorators: [withDesign],
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

BaseStackedAvatar.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/eI5afUtDh3y2Fg8SLYCR2X/%F0%9F%9F%A1-Updated-Design-System?node-id=24%3A1217',
  },
};
