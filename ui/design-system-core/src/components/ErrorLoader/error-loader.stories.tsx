import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ErrorLoader, { ErrorLoaderProps } from '.';

const meta: Meta<ErrorLoaderProps> = {
  title: 'Errors/ErrorLoader',
  component: ErrorLoader,
};

export default meta;
type Story = StoryObj<ErrorLoaderProps>;

export const BaseErrorLoader: Story = {
  render: () => (
    <ErrorLoader
      type="no-login"
      title="No Ethereum address detected"
      details="You need to login or allow access to your current Ethereum address in your Web3 Ethereum client like MetaMask, and then reload, please."
    />
  ),
};
