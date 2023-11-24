import React, { ReactElement } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Icon, { IconProps } from '@akashaorg/design-system-core/lib/components/Icon';
import {
  Akasha,
  Discord,
  Github,
  Telegram,
  Twitter,
  Widget,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
// import { CustomIconTypes } from '@akashaorg/design-system-core/src/components/Icon/akasha-icons';

const meta: Meta<IconProps> = {
  title: 'DSCore/Icons/Icon',
  component: Icon,
};

export default meta;
type Story = StoryObj<IconProps>;

const customIcons: ReactElement[] = [
  <Akasha />,
  <Discord />,
  <Github />,
  <Telegram />,
  <Twitter />,
  <Widget />,
];

const variants: IconProps[] = [
  {
    icon: <Akasha />,
    size: 'xs',
  },
  {
    icon: <Akasha />,
    size: 'sm',
  },
  {
    icon: <Akasha />,
  },
  {
    icon: <Akasha />,
    size: 'lg',
  },
];

export const CustomIcons: Story = {
  render: () => (
    <Stack spacing="gap-x-2">
      {customIcons.map((icon, idx) => (
        <Icon key={idx} icon={icon} color="white" />
      ))}
    </Stack>
  ),
};

export const IconVariants: Story = {
  render: () => (
    <Stack spacing="gap-x-2">
      {variants.map((variant, idx) => (
        <Icon key={idx} {...variant} color="white" />
      ))}
    </Stack>
  ),
};
