import React from 'react';
import { Grommet } from 'grommet';

import PlainButton from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Buttons/PlainButton',
  component: PlainButton,
  argTypes: {
    label: { control: 'text' },
  },
};

const Template = (args: any) => (
  <Grommet theme={lightTheme}>
    <PlainButton {...args} />
  </Grommet>
);

export const BasePlainButton = Template.bind({});
BasePlainButton.args = {
  label: 'Plain button',
  color: '#000',
};
