import React from 'react';
import { Grommet } from 'grommet';

import IconButton from '.';
import { Icon } from '../Icon';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Buttons/IconButton',
  component: IconButton,
  argTypes: {
    label: { control: 'text' },
    primary: { control: 'boolean' },
    secondary: { control: 'boolean' },
  },
};

const Template = (args: any) => (
  <Grommet theme={lightTheme}>
    <IconButton {...args} />
  </Grommet>
);

export const BaseIconButton = Template.bind({});
BaseIconButton.args = {
  label: 'Default icon button',
  icon: <Icon type="wallet" />,
};

export const PrimaryIconButton = Template.bind({});
PrimaryIconButton.args = {
  label: 'Primary icon button',
  icon: <Icon type="wallet" />,
  primary: true,
};

export const ShareIconButton = Template.bind({});
ShareIconButton.args = {
  label: 'Share profile',
  icon: <Icon type="reply" color="white" />,
  secondary: true,
};
