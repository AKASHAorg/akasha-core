import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Anchor, { AnchorProps } from '@akashaorg/design-system-core/lib/components/Anchor';
import Text from '@akashaorg/design-system-core/lib/components/Text';

const meta: Meta<AnchorProps> = {
  title: 'DSCore/Anchor/Anchor',
  component: Anchor,
  tags: ['autodocs'],
  argTypes: {
    href: { control: 'text' },
    target: {
      defaultValue: '_blank',
      control: 'select',
      options: ['_blank', '_self', '_parent', '_top'],
    },
    weight: { control: 'text' },
    customStyle: { control: 'text' },
  },
};

type Story = StoryObj<AnchorProps>;

export const Default: Story = {
  args: {
    href: 'https://akasha.org',
    children: <Text>Click me</Text>,
    weight: 'light',
    customStyle: 'w-[15%]',
  },
};

export default meta;
