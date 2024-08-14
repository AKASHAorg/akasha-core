import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FlagIcon } from '@heroicons/react/24/outline';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import MiniProfileCTA, {
  MiniProfileCTAProps,
} from '../../components/VibesConsoleContentCard/mini-profile-cta';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

const meta: Meta<MiniProfileCTAProps> = {
  title: 'DSComponents/Vibes/MiniProfileCTA',
  component: MiniProfileCTA,
  tags: ['autodocs'],
};

type Story = StoryObj<MiniProfileCTAProps>;

export const Default: Story = {
  args: {
    itemData: {
      avatar: {
        height: 320,
        src: 'https://placebeard.it/360x360',
        width: 320,
      },
      alternativeAvatars: [],
      name: 'Golden Showers',
      did: { id: 'somerandomdid' },
      nsfw: false,
    },
    nsfwLabel: 'Profile tagged NSFW',
    ctaExt: <Button variant="text" size="md" label="View Profile" />,
  },
};

export const IconButtonCTAExt: Story = {
  args: {
    itemData: {
      avatar: {
        height: 320,
        src: 'https://placebeard.it/360x360',
        width: 320,
      },
      alternativeAvatars: [],
      name: 'Golden Showers',
      did: { id: 'somerandomdid' },
      nsfw: false,
    },
    nsfwLabel: 'Profile tagged NSFW',
    ctaExt: (
      <Stack
        direction="row"
        align="center"
        spacing="gap-x-1"
        padding="py-2 px-3"
        customStyle="w-fit rounded-full bg-(secondaryLight/30 dark:secondaryDark)"
      >
        <Icon icon={<FlagIcon />} size="sm" color={{ light: 'secondaryLight', dark: 'grey2' }} />
        <Text variant="footnotes2" color={{ light: 'secondaryLight', dark: 'grey2' }}>
          12
        </Text>
      </Stack>
    ),
  },
};

export default meta;
