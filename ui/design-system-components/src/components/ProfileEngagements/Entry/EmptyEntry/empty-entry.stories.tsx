import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import EmptyEntry, { EmptyEntryProps } from '.';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const meta: Meta<EmptyEntryProps> = {
  title: 'Profile/EmptyEntry',
  component: EmptyEntry,
};

export default meta;
type Story = StoryObj<EmptyEntryProps>;

const variants: EmptyEntryProps[] = [
  {
    type: 'following',
  },
  {
    type: 'following',
    viewerIsOwner: false,
  },
];

export const BaseCard: Story = {
  render: () => (
    <Stack>
      {variants.map((variant, idx) => (
        <EmptyEntry key={idx} {...variant} />
      ))}
    </Stack>
  ),
};
