import type { Meta, StoryObj } from '@storybook/react';
import ConnectErrorCard, { ConnectErrorCardProps } from '../../components/ConnectErrorCard';

const meta: Meta<ConnectErrorCardProps> = {
  title: 'DSComponents/Errors/ConnectErrorCard',
  component: ConnectErrorCard,
  tags: ['autodocs'],
};

type Story = StoryObj<ConnectErrorCardProps>;

export const Default: Story = {
  args: {
    title: "Switch Your Wallet's Network",
    message:
      'To use AKASHA World during the Alpha period, you need to set the metamask wallet to Sepolia',
    action: { onClick: () => ({}), label: 'Retry' },
  },
};

export default meta;
