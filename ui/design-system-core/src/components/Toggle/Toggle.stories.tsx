import React from 'react';

import Toggle from './index';

export default {
  title: 'Buttons/Toggle',
  component: Toggle,
};

const Template = args => <Toggle {...args} />;

export const BaseToggle = Template.bind({});
BaseToggle.args = {
  label: 'Toggle button',
  checked: false,
};

export const LargeToggle = Template.bind({});
LargeToggle.args = {
  label: 'Toggle button',
  checked: false,
  iconChecked: 'SunIcon',
  iconUnchecked: 'MoonIcon',
  size: 'large',
};
export const IconToggle = Template.bind({});
IconToggle.args = {
  label: 'Toggle button',
  checked: false,
  iconChecked: 'SunIcon',
  iconUnchecked: 'MoonIcon',
};

export const DisabledToggle = Template.bind({});
DisabledToggle.args = {
  label: 'Toggle button',
  checked: false,
  size: 'large',
  disabled: true,
};
