import React from 'react';
import { Grommet } from 'grommet';

import EditableAvatar from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Avatars/EditableAvatar',
  component: EditableAvatar,
};

const ethAddress = '0x003410490050000320006570034567114572000';

const Template = (args: any) => (
  <Grommet theme={lightTheme}>
    <EditableAvatar {...args} />
  </Grommet>
);

export const BaseEditableAvatar = Template.bind({});

BaseEditableAvatar.args = {
  ethAddress: ethAddress,
  src: 'https://placebeard.it/360x360', // optional since this avatar is editable
  border: 'sm',
  size: 'xxl',
};
