import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import StartCard, { StartCardProps } from '../../components/StartCard';

const meta: Meta<StartCardProps> = {
  title: 'DSComponents/Cards/StartCard',
  component: StartCard,
};

export default meta;
type Story = StoryObj<StartCardProps>;

export const BaseStartCard: Story = {
  render: () => (
    <StartCard
      title="List"
      heading="✨ Save what inspires you ✨"
      image="https://placekitten.com/300/300"
      description="To create your unique feed view, subscribe to your favourite topics and find wonderful people to follow in our community."
    />
  ),
};
