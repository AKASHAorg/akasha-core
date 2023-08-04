import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import CircularPlaceholder, { CircularPlaceholderProps } from '.';
import Stack from '../Stack';

const meta: Meta<CircularPlaceholderProps> = {
  title: 'Placeholders/CircularPlaceholder',
  component: CircularPlaceholder,
};

export default meta;
type Story = StoryObj<CircularPlaceholderProps>;

const variants: CircularPlaceholderProps[] = [
  {
    width: 'w-10',
    height: 'h-10',
  },
  {
    width: 'w-10',
    height: 'h-10',
    animated: true,
  },
  {
    title: 'Placeholder',
  },
  {
    animated: true,
  },
];

export const BaseCircularPlaceholderVariants: Story = {
  render: () => (
    <Stack direction="column" spacing="gap-y-2">
      {variants.map(variant => (
        <CircularPlaceholder {...variant} />
      ))}
    </Stack>
  ),
};
