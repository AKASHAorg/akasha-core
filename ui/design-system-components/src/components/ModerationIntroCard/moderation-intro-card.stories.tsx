import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tw } from '@twind/core';

import ModerationIntroCard, { ModerationIntroCardProps } from '.';

const meta: Meta<ModerationIntroCardProps> = {
  title: 'Moderation/ModerationIntroCard',
  component: ModerationIntroCard,
};

export default meta;
type Story = StoryObj<ModerationIntroCardProps>;

export const BaseModerationIntroCard: Story = {
  render: () => (
    <div className={tw('w-[40%]')}>
      <ModerationIntroCard
        titleLabel="Overview"
        introLabel="Welcome to Vibe"
        subtitleLabel="Vibe facilitates cooperation and prevents abuse. The app is open and transparent. Take part in the process of governing this community."
        codeOfConductLabel="Read our Code of Conduct"
        overviewCTAArr={[
          {
            label: 'CoC discussions',
            url: '',
            iconType: 'SparklesIcon',
          },
          {
            label: 'Moderation thoughts',
            url: '',
            iconType: 'ChatBubbleOvalLeftEllipsisIcon',
          },
          {
            label: 'Send us a message',
            url: '',
            iconType: 'EnvelopeIcon',
          },
        ]}
      />
    </div>
  ),
};
