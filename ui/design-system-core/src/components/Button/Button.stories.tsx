import React from 'react';
import { Button } from './index';

export default {
  title: 'Button',
  component: Button,
};

const Template = args => <Button {...args} />;

export const DefaultButton = Template.bind({});
DefaultButton.args = {
  label: 'Button',
  icon: 'BeakerIcon',
  size: 'small',
};
export const LargeButton = Template.bind({});
LargeButton.args = {
  label: 'Button',
  icon: 'BeakerIcon',
  size: 'large',
};
export const XsmallButton = Template.bind({});
XsmallButton.args = {
  label: 'Button',
  icon: 'BeakerIcon',
  size: 'xsmall',
};
export const DisabledButton = Template.bind({});
DisabledButton.args = {
  label: 'Button',
  icon: 'BeakerIcon',
  disabled: true,
};

export const GreyButtonPrimary = Template.bind({});
GreyButtonPrimary.args = {
  label: 'Button',
  icon: 'BeakerIcon',
  size: 'xsmall',
  primary: true,
  greyBg: true,
};

export const GreyButton = Template.bind({});
GreyButton.args = {
  label: 'Button',
  icon: 'BeakerIcon',
  size: 'xsmall',
  greyBg: true,
};

export const TextOnlyButton = Template.bind({});
TextOnlyButton.args = {
  label: 'this is a text button',
  icon: 'BeakerIcon',
  textonly: true,
  primary: true,
};
export const TextOnlyButtonLoading = Template.bind({});
TextOnlyButtonLoading.args = {
  label: 'this is a loading text button',
  icon: 'BeakerIcon',
  textonly: true,
  primary: true,
  loading: true,
};
export const LoadingButton = Template.bind({});
LoadingButton.args = {
  label: 'Button',
  icon: 'BeakerIcon',
  loading: true,
};

export const RightIconButton = Template.bind({});
RightIconButton.args = {
  label: 'Right Icon',
  icon: 'BeakerIcon',
  iconRight: true,
};

export const PrimaryButton = Template.bind({});
PrimaryButton.args = {
  label: 'Primary Button',
  icon: 'BeakerIcon',
  primary: true,
};
export const IconButton = Template.bind({});
IconButton.args = {
  icon: 'BeakerIcon',
};
