import React, { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Anchor, { AnchorProps } from '@akashaorg/design-system-core/lib/components/Anchor';
import Text from '@akashaorg/design-system-core/lib/components/Text';

type TProps = PropsWithChildren<
  AnchorProps &
    React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
>;

const meta: Meta<TProps> = {
  title: 'DSCore/Anchor/Anchor',
  component: Anchor,
  tags: ['autodocs'],
  argTypes: {
    href: { control: 'text' },
    target: { default: '_blank', control: 'text' },
    weight: { control: 'text' },
    customStyle: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<TProps>;

export const BaseAnchor: Story = {
  args: {
    href: 'https://akasha.org',
    children: <Text>Click me</Text>,
    weight: 'light',
    customStyle: 'w-[15%]',
  },
};
