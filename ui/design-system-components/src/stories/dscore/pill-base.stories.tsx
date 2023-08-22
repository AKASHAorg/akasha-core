import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Pill, { PillProps } from '@akashaorg/design-system-core/lib/components/Pill';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const meta: Meta<PillProps> = {
  title: 'DSCore/Buttons/Pill',
  component: Pill,
};

export default meta;
type Story = StoryObj<PillProps>;

const variants: PillProps[] = [
  {
    label: 'Base pill',
  },
  {
    label: 'Large pill',
    size: 'lg',
  },
  {
    label: 'Large pill',
  },
  {
    label: 'Leading icon pill',
    icon: 'EnvelopeIcon',
    iconDirection: 'left',
  },
  {
    label: 'Trailing icon pill',
    icon: 'XMarkIcon',
    iconDirection: 'right',
  },
];

export const PillVariants: Story = {
  render: () => (
    <Stack spacing="gap-x-2">
      {variants.map((variant, idx) => (
        <Pill key={idx} {...variant} />
      ))}
    </Stack>
  ),
};
