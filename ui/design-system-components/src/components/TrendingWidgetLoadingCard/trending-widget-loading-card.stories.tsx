import React from 'react';
import { tw } from '@twind/core';
import type { Meta, StoryObj } from '@storybook/react';

import TrendingWidgetLoadingCard from '.';

const meta: Meta = {
  title: 'DSComponents/Cards/TrendingWidgetLoadingCard',
  component: TrendingWidgetLoadingCard,
};

export default meta;
type Story = StoryObj;

export const BaseCard: Story = {
  render: () => (
    <div className={tw('w-[25%]')}>
      <TrendingWidgetLoadingCard />
    </div>
  ),
};
