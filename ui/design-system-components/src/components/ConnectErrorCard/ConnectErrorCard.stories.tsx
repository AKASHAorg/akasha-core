import React from 'react';
import ConnectErrorCard, { ConnectErrorCardProps } from './index';

export default {
  title: 'Cards/ConnectErrorCard',
  component: ConnectErrorCard,
  argTypes: {},
};

const Template = (args: ConnectErrorCardProps) => <ConnectErrorCard {...args} />;

export const BasicConnectErrorCard = Template.bind({});

BasicConnectErrorCard.args = {
  title: 'Switch Your Wallet’s Network',
  message:
    'To use AKASHA World during the Alpha period, you need to set the metamask wallet to Goerli',
  action: { onClick: () => ({}), label: 'Retry' },
};
