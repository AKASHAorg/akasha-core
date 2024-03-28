import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Card, { TCardProps } from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';

Card.displayName = 'Card';

const meta: Meta<TCardProps> = {
  title: 'DSCore/Cards/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['plain', 'regular'] },
    elevation: { control: 'text' },
    background: { control: 'text' },
    dashedBorder: { control: 'boolean' },
    accentBorder: { control: 'boolean' },
    padding: { control: 'text' },
    margin: { control: 'text' },
    radius: { control: 'text' },
    border: { control: 'boolean' },
    noBorderRadius: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

type Story = StoryObj<TCardProps>;

const cardContents = (
  <React.Fragment>
    <Text>Card content</Text>
    <Text>Card content</Text>
    <Text>Card content</Text>
  </React.Fragment>
);

const baseArgs: Story = {
  args: {
    children: cardContents,
    type: 'regular',
    customStyle: 'w-[25%]',
  },
};

export const Default: Story = { args: { ...baseArgs.args } };

export const FullWidthCard: Story = {
  args: { ...baseArgs.args, fullWidth: true, customStyle: '' },
};

export const CardWithElevation: Story = { args: { ...baseArgs.args, elevation: '2' } };

export const CardWithDashedBorder: Story = { args: { ...baseArgs.args, dashedBorder: true } };

export const CardWithAccentBorder: Story = { args: { ...baseArgs.args, accentBorder: true } };

export const CardWithoutBorderRadius: Story = { args: { ...baseArgs.args, noBorderRadius: true } };

export default meta;
