import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Stack, { StackProps } from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

const meta: Meta<StackProps> = {
  title: 'DSCore/Stack/Stack',
  component: Stack,
};

export default meta;
type Story = StoryObj<StackProps>;

const variants: StackProps[] = [
  {
    direction: 'row',
    spacing: 'gap-x-3',
  },
  {
    direction: 'column',
    spacing: 'gap-y-3',
  },
];

export const StackVariants: Story = {
  render: () => (
    <Stack direction="column" spacing="gap-y-4">
      {variants.map((variant, idx) => (
        <Stack key={idx} {...variant}>
          <Text>item 1</Text>
          <Text>item 2</Text>
          <Text>item 3</Text>
          <Text>item 4</Text>
        </Stack>
      ))}
    </Stack>
  ),
};
