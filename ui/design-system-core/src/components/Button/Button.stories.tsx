import React from 'react';
import Button from '.';
import { ButtonProps } from './types';

export default {
  title: 'Buttons/Button',
  component: Button,
};

const Template = (args: ButtonProps) => <Button {...args} />;

export const BaseButton = Template.bind({});

BaseButton.args = {
  label: 'Button',
};

export const XSmallButtonPrimary = Template.bind({});

XSmallButtonPrimary.args = {
  label: 'Button',
  size: 'xsmall',
  icon: 'PlusIcon',
  variant: 'primary',
};

export const SmallButtonPrimary = Template.bind({});

SmallButtonPrimary.args = {
  label: 'Button',
  size: 'small',
  variant: 'primary',
};

export const SmallButtonWithLeftIconPrimary = Template.bind({});

SmallButtonWithLeftIconPrimary.args = {
  label: 'Button',
  size: 'small',
  icon: 'PlusIcon',
  iconDirection: 'left',
  variant: 'primary',
};

export const SmallButtonWithRightIconPrimary = Template.bind({});

SmallButtonWithRightIconPrimary.args = {
  label: 'Button',
  size: 'small',
  icon: 'PlusIcon',
  iconDirection: 'right',
  variant: 'primary',
};

export const SmallButtonLoadingPrimary = Template.bind({});

SmallButtonLoadingPrimary.args = {
  label: 'Button',
  loading: true,
  variant: 'primary',
};

export const SmallButtonDisabledPrimary = Template.bind({});

SmallButtonDisabledPrimary.args = {
  label: 'Button',
  icon: 'PlusIcon',
  iconDirection: 'right',
  disabled: true,
  variant: 'primary',
};

export const RegularButtonPrimary = Template.bind({});

RegularButtonPrimary.args = {
  label: 'Button',
  size: 'regular',
  variant: 'primary',
};

export const LargeButtonPrimary = Template.bind({});

LargeButtonPrimary.args = {
  label: 'Button',
  size: 'large',
  variant: 'primary',
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
  greyBg: true,
  disabled: true,
};

export const TextButton = Template.bind({});

TextButton.args = {
  label: 'Button',
  variant: 'text',
};

export const TextButtonLeftIcon = Template.bind({});

TextButtonLeftIcon.args = {
  label: 'Button',
  icon: 'PlusIcon',
  iconDirection: 'left',
  variant: 'text',
};

export const TextButtonRightIcon = Template.bind({});

TextButtonRightIcon.args = {
  label: 'Button',
  icon: 'PlusIcon',
  iconDirection: 'right',
  variant: 'text',
};

export const TextButtonLoading = Template.bind({});

TextButtonLoading.args = {
  label: 'Button',
  loading: true,
  variant: 'text',
};

export const TextButtonDisabled = Template.bind({});

TextButtonDisabled.args = {
  label: 'Button',
  icon: 'PlusIcon',
  iconDirection: 'right',
  variant: 'text',
  disabled: true,
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
