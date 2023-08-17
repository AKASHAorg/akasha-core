import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import LoginCTACard, { LoginCTACardProps } from '.';

const meta: Meta<LoginCTACardProps> = {
  title: 'Cards/LoginCTACard',
  component: LoginCTACard,
};

export default meta;
type Story = StoryObj<LoginCTACardProps>;

export const BaseLoginCTACard: Story = {
  render: () => (
    <LoginCTACard
      title="Welcome, fellow Ethereans! 💫"
      subtitle="We are in private alpha at this time. "
      beforeLinkLabel="If you'd like to participate,just "
      afterLinkLabel="and we'll send you a ticket for the next shuttle going to Akasha World."
      disclaimerLabel="Please bear in mind we're onboarding new people gradually to make sure our systems can scale up. Bon voyage! 🚀"
      writeToUsLabel="drop us a message"
      writeToUsUrl="mailto:alpha@ethereum.world"
    />
  ),
};
