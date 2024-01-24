import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text, { TextProps } from '@akashaorg/design-system-core/lib/components/Text';

const meta: Meta<TextProps> = {
  title: 'DSCore/Text/Text',
  component: Text,
};

export default meta;
type Story = StoryObj<TextProps>;

const variants: TextProps['variant'][] = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'label',
  'footnotes1',
  'footnotes2',
  'button-sm',
  'button-md',
  'button-lg',
];

export const TextVariants: Story = {
  render: () => (
    <Stack direction="column" spacing="gap-y-2">
      {variants.map((variant, idx) => (
        <Text key={idx} variant={variant}>
          {variant}: Almost before we knew it, we had left the ground.
        </Text>
      ))}
    </Stack>
  ),
};
