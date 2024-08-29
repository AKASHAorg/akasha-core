import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  ArrowUpOnSquareIcon,
  PencilIcon,
  TrashIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import List, { ListProps } from '@akashaorg/design-system-core/lib/components/List';

ArrowUpOnSquareIcon.displayName = 'ArrowUpOnSquareIcon';
PencilIcon.displayName = 'PencilIcon';
TrashIcon.displayName = 'TrashIcon';

List.displayName = 'List';

const meta: Meta<ListProps> = {
  title: 'DSCore/Lists/List',
  component: List,

  argTypes: {
    items: { control: 'object' },
    showDivider: { control: 'boolean' },
    customStyle: { control: 'text' },
    onSelected: { action: 'menu selected' },
  },
};

type Story = StoryObj<ListProps>;

export const Default: Story = {
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

export const ListWithoutDivider: Story = {
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
    showDivider: false,
  },
};

export default meta;
