import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ModerationValueCard, { ModerationValueCardProps } from '.';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const meta: Meta<ModerationValueCardProps> = {
  title: 'Moderation/ModerationValueCard',
  component: ModerationValueCard,
};

export default meta;
type Story = StoryObj<ModerationValueCardProps>;

const variants = [
  {
    isMini: true,
    label: 'Transparency',
    assetName: 'transparency',
  },

  {
    label: 'Transparency',
    assetName: 'transparency',
    description:
      'It needs to be easy for everyone to see what actions are performed. Our communities shall be build on tools and processes that strive for openness, communication and accountability.',
    ctaLabel: 'Discuss this value',
    ctaUrl: '',
  },
];

export const ModerationValueCardVariants: Story = {
  render: () => (
    <Stack direction="column" spacing="gap-y-2" customStyle="w-[40%]">
      {variants.map((variant, idx) => (
        <ModerationValueCard key={idx} {...variant} />
      ))}
    </Stack>
  ),
};
