import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ConnectErrorCard, { ConnectErrorCardProps } from '../../components/ConnectErrorCard';

const meta: Meta<ConnectErrorCardProps> = {
  title: 'DSComponents/Cards/ConnectErrorCard',
  component: ConnectErrorCard,
};

export default meta;
type Story = StoryObj<ConnectErrorCardProps>;

export const BaseConnectErrorCard: Story = {
  render: () => (
    <ConnectErrorCard
      title="Switch Your Wallet's Network"
      message="To use AKASHA World during the Alpha period, you need to set the metamask wallet to Sepolia"
      action={{ onClick: () => ({}), label: 'Retry' }}
    />
  ),
};
