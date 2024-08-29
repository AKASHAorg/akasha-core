import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TopbarLoader from '../../components/Loaders/topbar-loader';

const TopbarLoaderComponent = () => (
  <Stack customStyle="w-[50%]">
    <TopbarLoader />
  </Stack>
);

const meta: Meta = {
  title: 'DSComponents/Loaders/TopbarLoader',
  component: TopbarLoaderComponent,
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
