import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EntryLoadingPlaceholder from '../../components/Entry/EntryCardLoading';

const meta: Meta = {
  title: 'DSComponents/Loaders/EntryLoadingPlaceholder',
  component: () => (
    <Stack customStyle="w-[50%]">
      <EntryLoadingPlaceholder />
    </Stack>
  ),
  tags: ['autodocs'],
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
