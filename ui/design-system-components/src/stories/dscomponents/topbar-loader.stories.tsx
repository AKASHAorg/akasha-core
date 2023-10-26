import React from 'react';
import { tw } from '@twind/core';
import type { Meta, StoryObj } from '@storybook/react';

import TopbarLoader from '../../components/Loaders/topbar-loader';

const meta: Meta = {
  title: 'DSComponents/Loaders/TopbarLoader',
  component: TopbarLoader,
};

export default meta;
type Story = StoryObj;

export const BaseCard: Story = {
  render: () => (
    <div className={tw('w-[25%]')}>
      <TopbarLoader />
    </div>
  ),
};
