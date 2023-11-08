import React from 'react';
import { tw } from '@twind/core';
import type { Meta, StoryObj } from '@storybook/react';

import TrendingWidgetLoader from '../../components/Loaders/trending-widget-loader';

const meta: Meta = {
  title: 'DSComponents/Loaders/TrendingWidgetLoader',
  component: TrendingWidgetLoader,
};

export default meta;
type Story = StoryObj;

export const BaseCard: Story = {
  render: () => (
    <div className={tw('w-[25%]')}>
      <TrendingWidgetLoader />
    </div>
  ),
};
