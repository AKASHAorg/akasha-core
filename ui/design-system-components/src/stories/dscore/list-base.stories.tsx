import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import List, { ListProps } from '@akashaorg/design-system-core/lib/components/List';

const meta: Meta<ListProps> = {
  title: 'DSCore/Lists/List',
  component: List,
};

export default meta;
type Story = StoryObj<ListProps>;

export const BaseList: Story = {
  render: () => (
    <List
      items={[
        { label: 'Upload', icon: 'ArrowUpOnSquareIcon', onClick: () => ({}) },
        { label: 'Edit', icon: 'PencilIcon', onClick: () => ({}) },
        {
          label: 'Delete',
          icon: 'TrashIcon',
          color: { light: 'errorLight', dark: 'errorDark' },
          onClick: () => ({}),
        },
      ]}
    />
  ),
};
