import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Meter, { MeterProps } from '@akashaorg/design-system-core/lib/components/Meter';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const meta: Meta<MeterProps> = {
  title: 'DSCore/Meters/Meter',
  component: Meter,
};

export default meta;
type Story = StoryObj<MeterProps>;

const variants: MeterProps[] = [
  {
    size: 400,
    value: 60,
    thickness: 48,
  },
  {
    size: 400,
    value: 60,
    thickness: 48,
    type: 'bar',
  },
  {
    size: 400,
    value: 90,
    thickness: 48,
    type: 'bar',
    direction: 'vertical',
  },
];

export const MeterVariants: Story = {
  render: () => (
    <Stack>
      {variants.map((variant, idx) => (
        <Meter key={idx} {...variant} />
      ))}
    </Stack>
  ),
};
