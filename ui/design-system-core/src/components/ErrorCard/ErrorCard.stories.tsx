import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ErrorCard, { ErrorCardProps } from '.';

const meta: Meta<ErrorCardProps> = {
  title: 'Cards/ErrorCard',
  component: ErrorCard,
};

export default meta;
type Story = StoryObj<ErrorCardProps>;

export const BaseErrorCard: Story = {
  render: () => (
    <ErrorCard
      boxSize="18.75rem"
      errorType="no-authentication"
      titleLabel="This page is for our marvelous AKASHA World moderators"
      subtitleLabel="To view this page you must be an AKASHA World Moderator and log in with your wallet to continue."
      buttonLabel="Connect a wallet"
      textMarginBottom={true}
      hasButton={true}
    />
  ),
};
