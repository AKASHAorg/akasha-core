import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { BeakerIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import SubtitleTextIcon, {
  SubtitleTextIconProps,
} from '@akashaorg/design-system-core/lib/components/SubtitleTextIcon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const meta: Meta<SubtitleTextIconProps> = {
  title: 'DSCore/Icons/SubtitleTextIcon',
  component: SubtitleTextIcon,
};

export default meta;
type Story = StoryObj<SubtitleTextIconProps>;

const variants: SubtitleTextIconProps[] = [
  {
    label: 'Text',
    subtitle: 'Some text',
    icon: <BeakerIcon />,
    backgroundColor: true,
  },
  {
    label: 'Text',
    subtitle: 'Some text',
    backgroundColor: true,
  },
];

export const SubtitleTextIconVariants: Story = {
  render: () => (
    <Stack direction="column" spacing="gap-y-4">
      {variants.map((variant, idx) => (
        <SubtitleTextIcon key={idx} {...variant} />
      ))}
    </Stack>
  ),
};
