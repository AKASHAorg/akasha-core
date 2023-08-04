import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import BasicInfoCard, { BasicInfoCardProps } from '.';

const meta: Meta<BasicInfoCardProps> = {
  title: 'Cards/BasicInfoCard',
  component: BasicInfoCard,
};

export default meta;
type Story = StoryObj<BasicInfoCardProps>;

export const BaseBasicInfoCard: Story = {
  render: () => (
    <BasicInfoCard
      titleLabel="some title here"
      subtitleLabel="some subtitle there"
      customStyle="w-[25%]"
    />
  ),
};
