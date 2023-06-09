import React from 'react';

import Pill from './';

export default {
  title: 'Buttons/Pill',
  component: Pill,
};

const Template = args => <Pill {...args} />;

export const BasePill = Template.bind({});
BasePill.args = {
  label: 'Base pill',
};

export const LargePill = Template.bind({});
LargePill.args = {
  label: 'Large pill',
  size: 'lg',
};

export const ClickablePill = Template.bind({});
ClickablePill.args = {
  label: 'Large pill',
  clickable: true,
};

export const LeadingIconPill = Template.bind({});
LeadingIconPill.args = {
  label: 'Leading icon pill',
  icon: 'EnvelopeIcon',
  iconDirection: 'left',
};

export const TrailingIconPill = Template.bind({});
TrailingIconPill.args = {
  label: 'Trailing icon pill',
  icon: 'XMarkIcon',
  iconDirection: 'right',
};
