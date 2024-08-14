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

export const Default: Story = { args: { label: 'Pill label', type: 'action' } };

export const InfoPill: Story = {
  args: {
    label: 'Pill label',
    type: 'info',
    background: 'blue',
    borderColor: 'success',
    customStyle: 'w-20',
  },
};

export const LeadingIconPill: Story = {
  args: { label: 'Pill label', type: 'action', icon: <EnvelopeIcon />, iconDirection: 'left' },
};

export const TrailingIconPill: Story = {
  args: { label: 'Pill label', type: 'action', icon: <XMarkIcon />, iconDirection: 'right' },
};

export default meta;
