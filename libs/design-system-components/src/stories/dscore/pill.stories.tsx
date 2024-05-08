import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  EnvelopeIcon,
  XMarkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Pill, { PillProps } from '@akashaorg/design-system-core/lib/components/Pill';

const meta: Meta<PillProps> = {
  title: 'DSCore/Buttons/Pill',
  component: Pill,
  tags: ['autodocs'],
  argTypes: {
    customStyle: { control: 'text' },
    label: { control: 'text' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] },
    icon: { control: 'object' },
    iconDirection: { options: ['left', 'right'], control: { type: 'select' } },
    borderColor: { control: 'text' },
    background: { control: 'text' },
    type: { control: 'text' },
    active: { control: 'boolean' },
    loading: { control: 'boolean' },
    onPillClick: { action: 'pill clicked' },
  },
};

type Story = StoryObj<PillProps>;

const baseArgs: Story = {
  args: {
    label: 'Pill label',
  },
};

export const Default: Story = { args: { ...baseArgs.args, type: 'action' } };

export const InfoPill: Story = {
  args: {
    ...baseArgs.args,
    type: 'info',
    background: 'blue',
    borderColor: 'success',
    customStyle: 'w-20',
  },
};

export const LeadingIconPill: Story = {
  args: { ...baseArgs.args, type: 'action', icon: <EnvelopeIcon />, iconDirection: 'left' },
};

export const TrailingIconPill: Story = {
  args: { ...baseArgs.args, type: 'action', icon: <XMarkIcon />, iconDirection: 'right' },
};

export default meta;
