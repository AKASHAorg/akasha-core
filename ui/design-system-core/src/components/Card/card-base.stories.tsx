import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Card, { CardProps } from '.';

const meta: Meta<CardProps> = {
  title: 'Core/Cards/Card',
  component: Card,
};

export default meta;
type Story = StoryObj<CardProps>;

export const BaseCard: Story = {
  render: () => (
    <Card radius={8} customStyle="w-[25%]">
      <div>Card content</div>
    </Card>
  ),
};
