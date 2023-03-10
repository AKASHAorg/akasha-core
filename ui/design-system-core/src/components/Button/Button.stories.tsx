import React from 'react';
import Button from '.';

export default {
  title: 'Buttons/Button',
  component: Button,
};

const Template = args => <Button {...args} />;

export const BaseButton = Template.bind({});

BaseButton.args = {
  label: 'Button',
};

export const XSmallButton = Template.bind({});

XSmallButton.args = {
  label: 'Button',
  size: 'xsmall',
  icon: 'PlusIcon',
};

export const SmallButton = Template.bind({});

SmallButton.args = {
  label: 'Button',
  size: 'small',
};

export const SmallButtonWithLeftIcon = Template.bind({});

SmallButtonWithLeftIcon.args = {
  label: 'Button',
  size: 'small',
  icon: 'PlusIcon',
  iconDirection: 'left',
};

export const SmallButtonWithRightIcon = Template.bind({});

SmallButtonWithRightIcon.args = {
  label: 'Button',
  size: 'small',
  icon: 'PlusIcon',
  iconDirection: 'right',
};

export const SmallButtonLoading = Template.bind({});

SmallButtonLoading.args = {
  label: 'Button',
  loading: true,
};

export const SmallButtonDisabled = Template.bind({});

SmallButtonDisabled.args = {
  label: 'Button',
  disabled: true,
  icon: 'PlusIcon',
  iconDirection: 'right',
};

export const RegularButton = Template.bind({});

RegularButton.args = {
  label: 'Button',
  size: 'regular',
};

export const LargeButton = Template.bind({});

LargeButton.args = {
  label: 'Button',
  size: 'large',
};

export const XSmallSecondary = Template.bind({});

XSmallSecondary.args = {
  label: 'Button',
  size: 'xsmall',
  variant: 'secondary',
  icon: 'PlusIcon',
};

export const SmallButtonSecondary = Template.bind({});

SmallButtonSecondary.args = {
  label: 'Button',
  size: 'small',
  variant: 'secondary',
};

export const RegularButtonSecondary = Template.bind({});

RegularButtonSecondary.args = {
  label: 'Button',
  size: 'regular',
  variant: 'secondary',
};

export const LargeButtonSecondary = Template.bind({});

LargeButtonSecondary.args = {
  label: 'Button',
  size: 'large',
  variant: 'secondary',
};

export const RegularIconOnlyPrimary = Template.bind({});

RegularIconOnlyPrimary.args = {
  icon: 'PlusIcon',
  iconOnly: true,
  variant: 'primary',
};

export const RegularIconOnlyPrimaryLoading = Template.bind({});

RegularIconOnlyPrimaryLoading.args = {
  icon: 'PlusIcon',
  iconOnly: true,
  loading: true,
  variant: 'primary',
};

export const RegularIconOnlyPrimaryDisabled = Template.bind({});

RegularIconOnlyPrimaryDisabled.args = {
  icon: 'PlusIcon',
  iconOnly: true,
  variant: 'primary',
  disabled: true,
};

export const RegularIconOnlyPrimaryGreyBg = Template.bind({});

RegularIconOnlyPrimaryGreyBg.args = {
  icon: 'PlusIcon',
  iconOnly: true,
  variant: 'primary',
  greyBg: true,
};

export const RegularIconOnlyPrimaryGreyBgLoading = Template.bind({});

RegularIconOnlyPrimaryGreyBgLoading.args = {
  icon: 'PlusIcon',
  iconOnly: true,
  loading: true,
  variant: 'primary',
  greyBg: true,
};

export const RegularIconOnlyPrimaryGreyBgDisabled = Template.bind({});

RegularIconOnlyPrimaryGreyBgDisabled.args = {
  icon: 'PlusIcon',
  iconOnly: true,
  variant: 'primary',
  disabled: true,
  greyBg: true,
};

export const IconOnlyTextButton = Template.bind({});

IconOnlyTextButton.args = {
  icon: 'PlusIcon',
  iconOnly: true,
  variant: 'text',
};

export const IconOnlyTextButtonLoading = Template.bind({});

IconOnlyTextButtonLoading.args = {
  icon: 'PlusIcon',
  loading: true,
  iconOnly: true,
  variant: 'text',
};

export const IconOnlyTextButtonDisabled = Template.bind({});

IconOnlyTextButtonDisabled.args = {
  icon: 'PlusIcon',
  iconOnly: true,
  variant: 'text',
  disabled: true,
};
