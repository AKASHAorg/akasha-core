import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import InfoCard, { InfoCardProps } from '.';

const meta: Meta<InfoCardProps> = {
  title: 'Cards/InfoCard',
  component: InfoCard,
};

export default meta;
type Story = StoryObj<InfoCardProps>;

export const BaseInfoCard: Story = {
  render: () => <InfoCard titleLabel="Title label" bodyLabel="Subtitle label" />,
};
