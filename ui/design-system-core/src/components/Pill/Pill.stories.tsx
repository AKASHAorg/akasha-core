import React from 'react';

import Pill from './';

export default {
  title: 'Buttons/Pill',
  component: Pill,
};

const Template = args => <Pill {...args} />;

export const BasePill = Template.bind({});
BasePill.args = {
  label: 'base pill',
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

export const SecondaryBgPill = Template.bind({});
SecondaryBgPill.args = {
  label: 'Secondary bg pill',
  secondaryBg: true,
};

export const LeadingIconPill = Template.bind({});
LeadingIconPill.args = {
  label: 'leading icon pill',
  leadingIcon: 'EnvelopeIcon',
};

export const TrailingIconPill = Template.bind({});
TrailingIconPill.args = {
  label: 'trailing icon pill',
  trailingIcon: 'XMarkIcon',
};
