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

export const XSmallOutlined = Template.bind({});

XSmallOutlined.args = {
  label: 'Button',
  size: 'xsmall',
  variant: 'outlined',
  icon: 'PlusIcon',
};

export const SmallButtonOutlined = Template.bind({});

SmallButtonOutlined.args = {
  label: 'Button',
  size: 'small',
  variant: 'outlined',
};

export const RegularIconOnlyContained = Template.bind({});

RegularIconOnlyContained.args = {
  icon: 'PlusIcon',
  iconOnly: true,
  variant: 'contained',
};

export const RegularIconOnlyContainedLoading = Template.bind({});

RegularIconOnlyContainedLoading.args = {
  icon: 'PlusIcon',
  iconOnly: true,
  loading: true,
  variant: 'contained',
};

export const RegularIconOnlyContainedDisabled = Template.bind({});

RegularIconOnlyContainedDisabled.args = {
  icon: 'PlusIcon',
  iconOnly: true,
  variant: 'contained',
  disabled: true,
};

export const RegularIconOnlyContainedGreyBg = Template.bind({});

RegularIconOnlyContainedGreyBg.args = {
  icon: 'PlusIcon',
  iconOnly: true,
  variant: 'contained',
  greyBg: true,
};

export const RegularIconOnlyContainedGreyBgLoading = Template.bind({});

RegularIconOnlyContainedGreyBgLoading.args = {
  icon: 'PlusIcon',
  iconOnly: true,
  loading: true,
  variant: 'contained',
  greyBg: true,
};

export const RegularIconOnlyContainedGreyBgDisabled = Template.bind({});

RegularIconOnlyContainedGreyBgDisabled.args = {
  icon: 'PlusIcon',
  iconOnly: true,
  variant: 'contained',
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
