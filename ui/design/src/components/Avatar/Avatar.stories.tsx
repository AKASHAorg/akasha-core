import React from 'react';
import { Grommet } from 'grommet';

import Avatar from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Avatars/Avatar',
  component: Avatar,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const ethAddress = '0x003410490050000320006570034567114572000';

const Template = (args: any) => (
  <Grommet theme={lightTheme}>
    <Avatar {...args} />
  </Grommet>
);

export const DefaultAvatarStory = Template.bind({});

DefaultAvatarStory.args = {
  ethAddress: ethAddress,
  src: 'https://placebeard.it/360x360',
  margin: { margin: '0px' },
  border: 'sm',
};
