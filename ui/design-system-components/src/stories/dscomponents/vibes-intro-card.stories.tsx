import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tw } from '@twind/core';

import VibesIntroCard, { VibesIntroCardProps } from '../../components/VibesIntroCard';

const meta: Meta<VibesIntroCardProps> = {
  title: 'DSComponents/Vibes/VibesIntroCard',
  component: VibesIntroCard,
};

export default meta;
type Story = StoryObj<VibesIntroCardProps>;

export const BaseVibesIntroCard: Story = {
  render: () => (
    <div className={tw('w-[50%]')}>
      <VibesIntroCard
        titleLabel="Welcome to AKASHA Vibes"
        subtitleLabel="Vibes app facilitates cooperation and prevents abuse. The app is open and transparent. Take part in the process of governing this community."
        overviewCTAArr={[
          {
            label: 'CoC discussions',
            url: '',
          },
          {
            label: 'Vibes thoughts',
            url: '',
          },
          {
            label: 'Send us a message',
            url: '',
          },
        ]}
      />
    </div>
  ),
};
