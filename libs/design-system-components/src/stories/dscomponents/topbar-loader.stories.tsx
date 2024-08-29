import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TopbarLoader from '../../components/Loaders/topbar-loader';

const meta: Meta = {
  title: 'DSComponents/Loaders/TopbarLoader',
  component: () => (
    <Stack customStyle="w-[50%]">
      <TopbarLoader />
    </Stack>
  ),
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
