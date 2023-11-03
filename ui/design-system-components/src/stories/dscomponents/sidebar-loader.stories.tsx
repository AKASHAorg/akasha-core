import React from 'react';
import { tw } from '@twind/core';
import type { Meta, StoryObj } from '@storybook/react';

import SidebarLoader from '../../components/Loaders/sidebar-loader';

const meta: Meta = {
  title: 'DSComponents/Loaders/SidebarLoader',
  component: SidebarLoader,
};

export default meta;
type Story = StoryObj;

export const BaseCard: Story = {
  render: () => (
    <div className={tw('w-[25%]')}>
      <SidebarLoader />
    </div>
  ),
};
