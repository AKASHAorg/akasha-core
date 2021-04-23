import React from 'react';
import { Grommet } from 'grommet';

import Button from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Buttons/Button',
  component: Button,
  argTypes: {
    label: { control: 'text' },
    primary: { control: 'boolean' },
  },
};

const Template = (args: any) => (
  <Grommet theme={lightTheme}>
    <Button {...args} />
  </Grommet>
);

export const BaseButton = Template.bind({});
BaseButton.args = {
  label: 'Default button',
};

export const PrimaryButton = Template.bind({});
PrimaryButton.args = {
  label: 'Primary button',
  primary: true,
};
