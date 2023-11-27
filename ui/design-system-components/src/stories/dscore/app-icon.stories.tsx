import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import AppIcon, { AppIconProps } from '@akashaorg/design-system-core/lib/components/AppIcon';
import { BellIcon } from '@heroicons/react/24/outline';
import { Akasha } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import { BasicIconSize } from '@akashaorg/design-system-core/lib/components/types/common.types';

const meta: Meta<AppIconProps> = {
  title: 'DSCore/Icons/AppIcon',
  component: AppIcon,
};

export default meta;
type Story = StoryObj<AppIconProps>;

export const BaseAppIcon: Story = {
  render: () => <AppIcon placeholderIcon={<BellIcon />} stackedIcon={true} hasNewNotifs={true} />,
};

export const VariedSizesAppIcon: Story = {
  render: () => (
    <Stack spacing="gap-x-2">
      {['xs', 'sm', 'lg', 'xl'].map(size => (
        <AppIcon
          placeholderIcon={<Akasha />}
          solid={true}
          stackedIcon={true}
          hasNewNotifs={true}
          size={size as BasicIconSize}
        />
      ))}
    </Stack>
  ),
};

export const CustomColoredAppIcon: Story = {
  render: () => (
    <AppIcon
      placeholderIcon={<Akasha />}
      solid={true}
      stackedIcon={true}
      size="xs"
      iconColor="white"
      background="secondaryDark"
    />
  ),
};
