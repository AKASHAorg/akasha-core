import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Meter, { MeterProps } from '.';
import Stack from '../Stack';

const meta: Meta<MeterProps> = {
  title: 'Meters/Meter',
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
