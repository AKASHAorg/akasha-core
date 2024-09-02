import type { Meta, StoryObj } from '@storybook/react';
import SidebarLoader from '../../components/Loaders/sidebar-loader';

const meta: Meta = {
  title: 'DSComponents/Loaders/SidebarLoader',
  component: SidebarLoader,
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
