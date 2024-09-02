import type { Meta, StoryObj } from '@storybook/react';
import MiniProfileWidgetLoader from '../../components/Loaders/mini-profile-widget-loader';

const meta: Meta = {
  title: 'DSComponents/Loaders/MiniProfileWidgetLoader',
  component: MiniProfileWidgetLoader,
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
