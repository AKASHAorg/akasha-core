import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Spinner, { SpinnerProps } from '.';
import Stack from '../Stack';

const meta: Meta<SpinnerProps> = {
  title: 'Spinners/Spinner',
  component: Spinner,
};

export default meta;
type Story = StoryObj<SpinnerProps>;

const variants: SpinnerProps[] = [
  {
    size: 'sm',
  },
  {
    color: 'green',
  },
  {
    size: 'lg',
  },
  {
    size: 'xxl',
  },
];

export const SpinnerVariants: Story = {
  render: () => (
    <Stack direction="column" spacing="gap-y-2">
      {variants.map((variant, idx) => (
        <Spinner key={idx} {...variant} />
      ))}
    </Stack>
  ),
};
