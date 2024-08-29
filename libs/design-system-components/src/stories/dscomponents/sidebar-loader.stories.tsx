import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import SidebarLoader from '../../components/Loaders/sidebar-loader';

const SidebarLoaderComponent = () => (
  <Stack customStyle="w-[35%]">
    <SidebarLoader />
  </Stack>
);

const meta: Meta = {
  title: 'DSComponents/Loaders/SidebarLoader',
  component: SidebarLoaderComponent,
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
