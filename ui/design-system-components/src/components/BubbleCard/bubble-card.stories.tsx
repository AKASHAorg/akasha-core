import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import BubbleCard, { BubbleCardProps } from '.';

import { editorDefaultValue } from '../Editor/initialValue';

const meta: Meta<BubbleCardProps> = {
  title: 'DSComponents/Cards/BubbleCard',
  component: BubbleCard,
};

export default meta;
type Story = StoryObj<BubbleCardProps>;

export const BaseBubbleCard: Story = {
  render: () => (
    <BubbleCard
      locale="en"
      senderName="Jerry Mil"
      youLabel="You"
      content={editorDefaultValue}
      chatTimestamp="2022-06-16T10:07:15.000Z"
    />
  ),
};
