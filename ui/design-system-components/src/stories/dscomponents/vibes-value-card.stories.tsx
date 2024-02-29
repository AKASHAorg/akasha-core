import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import VibesValueCard, { VibesValueCardProps } from '../../components/VibesValuesCard/value-card';

const meta: Meta<VibesValueCardProps> = {
  title: 'DSComponents/Vibes/VibesValueCard',
  component: VibesValueCard,
};

export default meta;
type Story = StoryObj<VibesValueCardProps>;

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

export const VibesValueCardVariants: Story = {
  render: () => (
    <Stack direction="column" spacing="gap-y-2" customStyle="w-[40%]">
      {variants.map((variant, idx) => (
        <VibesValueCard key={variant.label + idx} publicImgPath="" {...variant} />
      ))}
    </Stack>
  ),
};
