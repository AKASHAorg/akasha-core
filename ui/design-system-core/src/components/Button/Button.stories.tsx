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
  size: 'xs',
  icon: 'PlusIcon',
  variant: 'primary',
};

export const SmallButtonPrimary = Template.bind({});

SmallButtonPrimary.args = {
  label: 'Button',
  size: 'sm',
  variant: 'primary',
};

export const SmallButtonWithLeftIconPrimary = Template.bind({});

SmallButtonWithLeftIconPrimary.args = {
  label: 'Button',
  size: 'sm',
  icon: 'PlusIcon',
  iconDirection: 'left',
  variant: 'primary',
};

export const SmallButtonWithRightIconPrimary = Template.bind({});

SmallButtonWithRightIconPrimary.args = {
  label: 'Button',
  size: 'sm',
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

export const MediumButtonPrimary = Template.bind({});

MediumButtonPrimary.args = {
  label: 'Button',
  size: 'md',
  variant: 'primary',
};

export const LargeButtonPrimary = Template.bind({});

LargeButtonPrimary.args = {
  label: 'Button',
  size: 'lg',
  variant: 'primary',
};

export const ActivePrimaryButton = Template.bind({});

ActivePrimaryButton.args = {
  label: 'Button',
  variant: 'primary',
  active: true,
  icon: 'CheckIcon',
  iconDirection: 'right',
};

export const XSmallSecondary = Template.bind({});

XSmallSecondary.args = {
  label: 'Button',
  size: 'xs',
  variant: 'secondary',
  icon: 'PlusIcon',
};

export const SmallButtonSecondary = Template.bind({});

SmallButtonSecondary.args = {
  label: 'Button',
  size: 'sm',
  variant: 'secondary',
};

export const MediumButtonSecondary = Template.bind({});

MediumButtonSecondary.args = {
  label: 'Button',
  size: 'md',
  variant: 'secondary',
};

export const LargeButtonSecondary = Template.bind({});

LargeButtonSecondary.args = {
  label: 'Button',
  size: 'lg',
  variant: 'secondary',
};

export const MediumIconOnlyPrimary = Template.bind({});

MediumIconOnlyPrimary.args = {
  icon: 'PlusIcon',
  size: 'md',
  iconOnly: true,
  variant: 'primary',
};

export const MediumIconOnlyPrimaryLoading = Template.bind({});

MediumIconOnlyPrimaryLoading.args = {
  icon: 'PlusIcon',
  size: 'md',
  iconOnly: true,
  loading: true,
  variant: 'primary',
};

export const MediumIconOnlyPrimaryDisabled = Template.bind({});

MediumIconOnlyPrimaryDisabled.args = {
  icon: 'PlusIcon',
  size: 'md',
  iconOnly: true,
  variant: 'primary',
  disabled: true,
};

export const MediumIconOnlyPrimaryGreyBg = Template.bind({});

MediumIconOnlyPrimaryGreyBg.args = {
  icon: 'PlusIcon',
  size: 'md',
  iconOnly: true,
  variant: 'primary',
  greyBg: true,
};

export const MediumIconOnlyPrimaryGreyBgLoading = Template.bind({});

MediumIconOnlyPrimaryGreyBgLoading.args = {
  icon: 'PlusIcon',
  size: 'md',
  iconOnly: true,
  loading: true,
  variant: 'primary',
  greyBg: true,
};

export const MediumIconOnlyPrimaryGreyBgDisabled = Template.bind({});

MediumIconOnlyPrimaryGreyBgDisabled.args = {
  icon: 'PlusIcon',
  size: 'md',
  iconOnly: true,
  variant: 'primary',
  greyBg: true,
  disabled: true,
};

export const ActiveSecondaryButton = Template.bind({});

ActiveSecondaryButton.args = {
  label: 'Button',
  variant: 'secondary',
  active: true,
  icon: 'CheckIcon',
  iconDirection: 'right',
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
