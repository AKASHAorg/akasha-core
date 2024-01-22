import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import EmptyEntry, { EmptyEntryProps } from '../../components/ProfileEngagements/Entry/EmptyEntry';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const meta: Meta<EmptyEntryProps> = {
  title: 'DSComponents/Profile/EmptyEntry',
  component: EmptyEntry,
};

export default meta;
type Story = StoryObj<EmptyEntryProps>;

const variants: EmptyEntryProps[] = [
  {
    titleLabel: 'This user has no followers yet',
  },
  {
    titleLabel: 'This user is not following anyone yet',
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
