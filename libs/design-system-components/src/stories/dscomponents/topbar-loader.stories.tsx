import type { Meta, StoryObj } from '@storybook/react';
import TopbarLoader from '../../components/Loaders/topbar-loader';

const meta: Meta = {
  title: 'DSComponents/Loaders/TopbarLoader',
  component: TopbarLoader,
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
