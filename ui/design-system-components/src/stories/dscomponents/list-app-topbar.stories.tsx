import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ListAppTopbar, { ListAppTopbarProps } from '../../components/ListAppTopbar';

const meta: Meta<ListAppTopbarProps> = {
  title: 'DSComponents/ListApp/ListAppTopbar',
  component: ListAppTopbar,
};

export default meta;
type Story = StoryObj<ListAppTopbarProps>;

export const BaseListAppTopbar: Story = {
  render: () => <ListAppTopbar handleIconMenuClick={() => ({})} />,
};
