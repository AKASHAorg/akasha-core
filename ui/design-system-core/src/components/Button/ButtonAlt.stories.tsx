import React from 'react';
import { ButtonAlt } from '.';

export default {
  title: 'Buttons/ButtonAlt',
  component: ButtonAlt,
};

const Template = args => <ButtonAlt {...args} />;

export const BaseButton = Template.bind({});

BaseButton.args = {
  label: 'Button',
};

export const TextOnlyButton = Template.bind({});

TextOnlyButton.args = {
  label: 'Button',
  textOnly: true,
};

export const ButtonWithSize = Template.bind({});

ButtonWithSize.args = {
  size: 'small',
  label: 'Small Button',
};

export const XsmallButton = Template.bind({});

XsmallButton.args = {
  size: 'xsmall',
  icon: 'PlusIcon',
  label: 'Small Button',
};

export const PrimaryButton = Template.bind({});

PrimaryButton.args = {
  label: 'Primary Button',
  primary: true,
};

export const IconButton = Template.bind({});

IconButton.args = {
  icon: 'BeakerIcon',
  label: 'Icon Button',
};

export const TextOnlyIconButton = Template.bind({});

TextOnlyIconButton.args = {
  icon: 'BeakerIcon',
  label: 'Icon Button',
  textOnly: true,
};

export const LeftIconButton = Template.bind({});

LeftIconButton.args = {
  icon: 'BeakerIcon',
  label: 'Left Icon Button',
  leftIcon: true,
};

export const TextOnlyLeftIconButton = Template.bind({});

TextOnlyLeftIconButton.args = {
  icon: 'BeakerIcon',
  label: 'Left Icon Button',
  leftIcon: true,
  textOnly: true,
};

export const IconOnlyButton = Template.bind({});

IconOnlyButton.args = {
  icon: 'BeakerIcon',
  iconOnly: true,
};

export const TextOnlyIconOnlyButton = Template.bind({});

TextOnlyIconOnlyButton.args = {
  icon: 'BeakerIcon',
  iconOnly: true,
  textOnly: true,
};

export const IconOnlyGreyBgButton = Template.bind({});

IconOnlyGreyBgButton.args = {
  icon: 'BeakerIcon',
  greyBg: true,
  iconOnly: true,
};

export const DisabledButton = Template.bind({});

DisabledButton.args = {
  label: 'Disabled Button',
  disabled: true,
};

export const LoadingButton = Template.bind({});

LoadingButton.args = {
  label: 'Loading Button',
  loading: true,
};
