import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import AppIcon, { AppIconProps } from '.';
import Stack from '../Stack';

import { BasicIconSize } from '../types/common.types';

const meta: Meta<AppIconProps> = {
  title: 'Icons/AppIcon',
  component: AppIcon,
};

export default meta;
type Story = StoryObj<AppIconProps>;

export const BaseAppIcon: Story = {
  render: () => <AppIcon placeholderIconType="BellIcon" stackedIcon={true} hasNewNotifs={true} />,
};

export const VariedSizesAppIcon: Story = {
  render: () => (
    <Stack spacing="gap-x-2">
      {['xs', 'sm', 'lg', 'xl'].map(size => (
        <AppIcon
          placeholderIconType="BellIcon"
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
      placeholderIconType="BellIcon"
      stackedIcon={true}
      size="xs"
      iconColor="white"
      background="secondaryDark"
    />
  ),
};
