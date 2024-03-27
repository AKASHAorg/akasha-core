import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  ArrowUpOnSquareIcon,
  PencilIcon,
  TrashIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import List, { ListProps } from '@akashaorg/design-system-core/lib/components/List';

const meta: Meta<ListProps> = {
  title: 'DSCore/Lists/List',
  component: List,
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' },
    showDivider: { control: 'boolean' },
    customStyle: { control: 'text' },
    onSelected: { action: 'menu selected' },
  },
};

type Story = StoryObj<ListProps>;

const baseArgs: Story = {
  args: {
    items: [
      { label: 'Upload', icon: <ArrowUpOnSquareIcon />, onClick: () => ({}) },
      { label: 'Edit', icon: <PencilIcon />, onClick: () => ({}) },
      {
        label: 'Delete',
        icon: <TrashIcon />,
        color: { light: 'errorLight', dark: 'errorDark' },
        onClick: () => ({}),
      },
    ],
  },
};

export const Default: Story = {
  args: {
    ...baseArgs.args,
  },
};

export const ListWithoutDivider: Story = {
  args: {
    ...baseArgs.args,
    showDivider: false,
  },
};

export default meta;
