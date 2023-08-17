import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ListAppTopbar, { ListAppTopbarProps } from '.';

const meta: Meta<ListAppTopbarProps> = {
  title: 'ListApp/ListAppTopbar',
  component: ListAppTopbar,
};

export default meta;
type Story = StoryObj<ListAppTopbarProps>;

export const BaseListAppTopbar: Story = {
  render: () => <ListAppTopbar handleIconMenuClick={() => ({})} />,
};
