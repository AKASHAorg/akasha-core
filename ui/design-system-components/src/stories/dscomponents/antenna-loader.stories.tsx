import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AntennaLoader from '../../components/Loaders/antenna-loader';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const Wrapped: React.FC<unknown> = () => (
  <Stack customStyle="w-[50%]">
    <AntennaLoader />
  </Stack>
);

const meta: Meta = {
  title: 'DSComponents/Loaders/AntennaLoader',
  component: Wrapped,
  tags: ['autodocs'],
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
