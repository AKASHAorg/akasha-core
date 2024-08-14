import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import MiniProfileWidgetLoader from '../../components/Loaders/mini-profile-widget-loader';

const meta: Meta = {
  title: 'DSComponents/Loaders/MiniProfileWidgetLoader',
  component: () => (
    <Stack customStyle="w-[25%]">
      <MiniProfileWidgetLoader />
    </Stack>
  ),
  tags: ['autodocs'],
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
