import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Button from '.';
import Stack from '../Stack';
import { ButtonProps } from './types';

const meta: Meta<ButtonProps> = {
  title: 'Buttons/Button',
  component: Button,
};

export default meta;
type Story = StoryObj<ButtonProps>;

const variants: ButtonProps[] = [
  {
    label: 'Button',
  },
  {
    label: 'Button',
    size: 'xs',
    icon: 'PlusIcon',
    variant: 'primary',
  },
  {
    label: 'Button',
    size: 'sm',
    variant: 'primary',
  },
  {
    label: 'Button',
    size: 'sm',
    icon: 'PlusIcon',
    iconDirection: 'left',
    variant: 'primary',
  },
  {
    label: 'Button',
    size: 'sm',
    icon: 'PlusIcon',
    iconDirection: 'right',
    variant: 'primary',
  },
  {
    label: 'Button',
    loading: true,
    variant: 'primary',
  },
  {
    label: 'Button',
    icon: 'PlusIcon',
    iconDirection: 'right',
    disabled: true,
    variant: 'primary',
  },
  {
    label: 'Button',
    size: 'md',
    variant: 'primary',
  },
  {
    label: 'Button',
    size: 'lg',
    variant: 'primary',
  },
  {
    label: 'Button',
    variant: 'primary',
    active: true,
    icon: 'CheckIcon',
    iconDirection: 'right',
  },
  {
    label: 'Button',
    size: 'xs',
    variant: 'secondary',
    icon: 'PlusIcon',
  },
  {
    label: 'Button',
    size: 'sm',
    variant: 'secondary',
  },
  {
    label: 'Button',
    size: 'md',
    variant: 'secondary',
  },
  {
    label: 'Button',
    size: 'lg',
    variant: 'secondary',
  },
  {
    icon: 'PlusIcon',
    size: 'md',
    iconOnly: true,
    variant: 'primary',
  },
  {
    icon: 'PlusIcon',
    size: 'md',
    iconOnly: true,
    loading: true,
    variant: 'primary',
  },
  {
    icon: 'PlusIcon',
    size: 'md',
    iconOnly: true,
    variant: 'primary',
    disabled: true,
  },
  {
    icon: 'PlusIcon',
    size: 'md',
    iconOnly: true,
    variant: 'primary',
    greyBg: true,
  },
  {
    icon: 'PlusIcon',
    size: 'md',
    iconOnly: true,
    loading: true,
    variant: 'primary',
    greyBg: true,
  },
  {
    icon: 'PlusIcon',
    size: 'md',
    iconOnly: true,
    variant: 'primary',
    greyBg: true,
    disabled: true,
  },
  {
    label: 'Button',
    variant: 'secondary',
    active: true,
    icon: 'CheckIcon',
    iconDirection: 'right',
  },
  {
    label: 'Button',
    variant: 'text',
  },
  {
    label: 'Button',
    icon: 'PlusIcon',
    iconDirection: 'left',
    variant: 'text',
  },
  {
    label: 'Button',
    icon: 'PlusIcon',
    iconDirection: 'right',
    variant: 'text',
  },
  {
    label: 'Button',
    loading: true,
    variant: 'text',
  },
  {
    label: 'Button',
    icon: 'PlusIcon',
    iconDirection: 'right',
    variant: 'text',
    disabled: true,
  },
  {
    icon: 'PlusIcon',
    iconOnly: true,
    variant: 'text',
  },
  {
    icon: 'PlusIcon',
    loading: true,
    iconOnly: true,
    variant: 'text',
  },
  {
    icon: 'PlusIcon',
    iconOnly: true,
    variant: 'text',
    disabled: true,
  },
];

export const ButtonVariants: Story = {
  render: () => (
    <Stack direction="column" spacing="gap-y-2">
      {variants.map((variant, idx) => (
        <Button key={idx} customStyle="w-fit" {...variant} />
      ))}
    </Stack>
  ),
};
