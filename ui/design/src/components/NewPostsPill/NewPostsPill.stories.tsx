import React from 'react';
import { Grommet } from 'grommet';

import NewPostsPill, { INewPostsPill } from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import { userData } from '../../utils/dummy-data';

export default {
  title: 'Notifications/NewPostsPill',
  component: NewPostsPill,
  argTypes: {
    infoLabel: { control: 'text' },
    handleDismiss: { action: 'pill dismissed' },
  },
};

const Template = (args: INewPostsPill) => (
  <Grommet theme={lightTheme}>
    <NewPostsPill {...args} />
  </Grommet>
);

export const BaseNewPostsPill = Template.bind({});

BaseNewPostsPill.args = {
  infoLabel: 'New posts recently published',
  userData: userData,
};
