import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TrendingWidgetLoader from '../../components/Loaders/trending-widget-loader';

const Wrapped: React.FC<unknown> = () => (
  <Stack customStyle="w-[50%]">
    <TrendingWidgetLoader />
  </Stack>
);

const meta: Meta = {
  title: 'DSComponents/Loaders/TrendingWidgetLoader',
  component: Wrapped,
  tags: ['autodocs'],
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
