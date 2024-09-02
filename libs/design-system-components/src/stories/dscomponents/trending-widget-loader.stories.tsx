import type { Meta, StoryObj } from '@storybook/react';
import TrendingWidgetLoader from '../../components/Loaders/trending-widget-loader';

const meta: Meta = {
  title: 'DSComponents/Loaders/TrendingWidgetLoader',
  component: TrendingWidgetLoader,
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
