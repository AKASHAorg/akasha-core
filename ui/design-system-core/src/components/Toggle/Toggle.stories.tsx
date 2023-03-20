import React from 'react';

import Toggle from './index';

export default {
  title: 'Buttons/Toggle',
  component: Toggle,
};

const Template = args => {
  const [checked, setChecked] = React.useState<boolean>(args.checked);

  const handleChange = () => {
    setChecked(!checked);
  };

  return <Toggle checked={checked} onChange={handleChange} {...args} />;
};

export const BaseToggle = Template.bind({});
BaseToggle.args = {
  label: 'Toggle button',
  checked: false,
};

export const LargeToggle = Template.bind({});
LargeToggle.args = {
  checked: false,
  iconChecked: 'SunIcon',
  iconUnchecked: 'MoonIcon',
  size: 'large',
  darkModeToggle: true,
};

export const IconToggle = Template.bind({});
IconToggle.args = {
  checked: false,
  iconChecked: 'SunIcon',
  iconUnchecked: 'MoonIcon',
};

export const DisabledIconToggle = Template.bind({});
DisabledIconToggle.args = {
  checked: true,
  iconChecked: 'SunIcon',
  iconUnchecked: 'MoonIcon',
  disabled: true,
};

export const DisabledToggle = Template.bind({});
DisabledToggle.args = {
  checked: false,
  size: 'large',
  disabled: true,
};

export const DisabledCheckedToggle = Template.bind({});
DisabledCheckedToggle.args = {
  checked: true,
  size: 'large',
  disabled: true,
};
