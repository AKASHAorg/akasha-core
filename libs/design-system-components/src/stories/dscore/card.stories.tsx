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

export const Default: Story = {
  args: {
    children: (
      <React.Fragment>
        <Text>Card content</Text>
        <Text>Card content</Text>
        <Text>Card content</Text>
      </React.Fragment>
    ),
    type: 'regular',
    customStyle: 'w-[25%]',
  },
};

export const FullWidthCard: Story = {
  args: {
    children: (
      <React.Fragment>
        <Text>Card content</Text>
        <Text>Card content</Text>
        <Text>Card content</Text>
      </React.Fragment>
    ),
    type: 'regular',
    fullWidth: true,
    customStyle: '',
  },
};

export const CardWithElevation: Story = {
  args: {
    children: (
      <React.Fragment>
        <Text>Card content</Text>
        <Text>Card content</Text>
        <Text>Card content</Text>
      </React.Fragment>
    ),
    type: 'regular',
    customStyle: 'w-[25%]',
    elevation: '2',
  },
};

export const CardWithDashedBorder: Story = {
  args: {
    children: (
      <React.Fragment>
        <Text>Card content</Text>
        <Text>Card content</Text>
        <Text>Card content</Text>
      </React.Fragment>
    ),
    type: 'regular',
    customStyle: 'w-[25%]',
    dashedBorder: true,
  },
};

export const CardWithAccentBorder: Story = {
  args: {
    children: (
      <React.Fragment>
        <Text>Card content</Text>
        <Text>Card content</Text>
        <Text>Card content</Text>
      </React.Fragment>
    ),
    type: 'regular',
    customStyle: 'w-[25%]',
    accentBorder: true,
  },
};

export const CardWithoutBorderRadius: Story = {
  args: {
    children: (
      <React.Fragment>
        <Text>Card content</Text>
        <Text>Card content</Text>
        <Text>Card content</Text>
      </React.Fragment>
    ),
    type: 'regular',
    customStyle: 'w-[25%]',
    noBorderRadius: true,
  },
};

export default meta;
