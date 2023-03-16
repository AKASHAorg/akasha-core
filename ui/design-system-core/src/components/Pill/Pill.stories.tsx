import React from 'react';

import Pill from './';

export default {
  title: 'Buttons/Pill',
  component: Pill,
};

const Template = args => <Pill {...args} />;

export const BasePill = Template.bind({});
BasePill.args = {
  leadingIcon: 'EnvelopeIcon',
  infoLabel: 'This is a label',
  trailingIcon: 'XMarkIcon',
};

export const LargePill = Template.bind({});
LargePill.args = {
  leadingIcon: 'EnvelopeIcon',
  infoLabel: 'Pill text',
  secondaryBg: true,
  trailingIcon: 'XMarkIcon',
  size: 'large',
};

export const SecondaryPill = Template.bind({});
SecondaryPill.args = {
  leadingIcon: 'EnvelopeIcon',
  infoLabel: 'Following',
  trailingIcon: 'XMarkIcon',
  secondaryBg: true,
};

export const LeadingIconPill = Template.bind({});
LeadingIconPill.args = {
  leadingIcon: 'EnvelopeIcon',
  infoLabel: 'Pill text',
  size: 'large',
};

export const TrailingIconPill = Template.bind({});
TrailingIconPill.args = {
  trailingIcon: 'XMarkIcon',
  infoLabel: 'Pill text',
  size: 'large',
};
