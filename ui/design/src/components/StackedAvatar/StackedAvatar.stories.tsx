import React from 'react';
import { Grommet } from 'grommet';

import StackedAvatar from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Avatars/StackedAvatar',
  component: StackedAvatar,
};

const userData: { ethAddress: string; avatar?: string }[] = [
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    avatar: 'https://placebeard.it/360x360',
  },
  {
    ethAddress: '0x004410490050000320006570034567114572001',
    avatar: 'https://placebeard.it/360x360',
  },
  {
    ethAddress: '0x005410490050000320006570034567114572002',
    avatar: 'https://placebeard.it/360x360',
  },
  {
    ethAddress: '0x006410490050000320006570034567114572003',
    avatar: 'https://placebeard.it/360x360',
  },
];

const Template = (args: any) => (
  <Grommet theme={lightTheme}>
    <StackedAvatar {...args} />
  </Grommet>
);

export const BaseStackedAvatar = Template.bind({});

BaseStackedAvatar.args = {
  userData: userData,
  maxAvatars: 3, // slices this number from user data and renders the corresponding avatars
};
