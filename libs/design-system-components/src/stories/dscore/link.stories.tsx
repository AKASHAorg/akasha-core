import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Link, { LinkProps } from '@akashaorg/design-system-core/lib/components/Link';
import Text from '@akashaorg/design-system-core/lib/components/Text';

Link.displayName = 'Link';

const meta: Meta<LinkProps> = {
  title: 'DSCore/Link/Link',
  component: Link,
  argTypes: {
    to: { control: 'text' },
    target: {
      defaultValue: '_blank',
      control: 'select',
      options: ['_blank', '_self', '_parent', '_top'],
    },
    weight: { control: 'text' },
    customStyle: { control: 'text' },
  },
};

type Story = StoryObj<LinkProps>;

export const Default: Story = {
  args: {
    to: 'https://akasha.org',
    children: <Text>Click me</Text>,
    weight: 'light',
    customStyle: 'w-[15%]',
  },
};

export default meta;
