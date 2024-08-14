import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Dropdown, { DropdownProps } from '@akashaorg/design-system-core/lib/components/Dropdown';
import { BeakerIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

const meta: Meta<DropdownProps> = {
  title: 'DSCore/Buttons/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    placeholderLabel: { control: 'text' },
    selected: { control: 'object' },
    menuItems: { control: 'object' },
    setSelected: { action: 'selected set' },
  },
};

type Story = StoryObj<DropdownProps>;

export const Default: Story = {
  args: {
    name: 'Dropdown',
    menuItems: [
      { id: '1', icon: <BeakerIcon />, title: 'Option 1' },
      { id: '2', icon: <ArchiveBoxIcon />, title: 'Option 2' },
      { id: '3', icon: <ArchiveBoxIcon />, title: 'Option 3' },
    ],
  },
};

export const DropdownWithoutIcon: Story = {
  args: {
    name: 'Dropdown',
    menuItems: [
      { id: '1', title: 'Option 1' },
      { id: '2', title: 'Option 2' },
    ],
  },
};

export const DropdownWithLabel: Story = {
  args: {
    name: 'Dropdown',
    menuItems: [
      { id: '1', icon: <BeakerIcon />, title: 'Option 1' },
      { id: '2', icon: <ArchiveBoxIcon />, title: 'Option 2' },
      { id: '3', icon: <ArchiveBoxIcon />, title: 'Option 3' },
    ],
    label: 'Select one',
  },
};

export const DropdownWithPlaceholderLabel: Story = {
  args: {
    name: 'Dropdown',
    menuItems: [
      { id: '1', icon: <BeakerIcon />, title: 'Option 1' },
      { id: '2', icon: <ArchiveBoxIcon />, title: 'Option 2' },
      { id: '3', icon: <ArchiveBoxIcon />, title: 'Option 3' },
    ],
    placeholderLabel: 'Select an option',
  },
};

export default meta;
