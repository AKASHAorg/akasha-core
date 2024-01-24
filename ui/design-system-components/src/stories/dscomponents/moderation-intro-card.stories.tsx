import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tw } from '@twind/core';

import ModerationIntroCard, {
  ModerationIntroCardProps,
} from '../../components/ModerationIntroCard';
import {
  SparklesIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

const meta: Meta<ModerationIntroCardProps> = {
  title: 'DSComponents/Moderation/ModerationIntroCard',
  component: ModerationIntroCard,
};

export default meta;
type Story = StoryObj<ModerationIntroCardProps>;

export const BaseModerationIntroCard: Story = {
  render: () => (
    <div className={tw('w-[50%]')}>
      <ModerationIntroCard
        publicImgPath=""
        titleLabel="Overview"
        introLabel="Welcome to Vibe"
        subtitleLabel="Vibe facilitates cooperation and prevents abuse. The app is open and transparent. Take part in the process of governing this community."
        codeOfConductLabel="Read our Code of Conduct"
        overviewCTAArr={[
          {
            label: 'CoC discussions',
            url: '',
            icon: <SparklesIcon />,
          },
          {
            label: 'Moderation thoughts',
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
