import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tw } from '@twind/core';

import VibesIntroCard, { VibesIntroCardProps } from '../../components/VibesIntroCard';
import {
  SparklesIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

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
        publicImgPath=""
        titleLabel="Overview"
        introLabel="Welcome to AKASHA Vibes"
        subtitleLabel="Vibes app facilitates cooperation and prevents abuse. The app is open and transparent. Take part in the process of governing this community."
        codeOfConductLabel="Read our Code of Conduct"
        overviewCTAArr={[
          {
            label: 'CoC discussions',
            url: '',
            icon: <SparklesIcon />,
          },
          {
            label: 'Vibes thoughts',
            url: '',
            icon: <ChatBubbleOvalLeftEllipsisIcon />,
          },
          {
            label: 'Send us a message',
            url: '',
            icon: <EnvelopeIcon />,
          },
        ]}
      />
    </div>
  ),
};
