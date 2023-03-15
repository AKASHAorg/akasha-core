import React from 'react';
import { tw } from '@twind/core';

import ModerationIntroCard, { IModerationIntroCardProps } from '.';

export default {
  title: 'Moderation/ModerationIntroCard',
  component: ModerationIntroCard,
};

const Template = (args: IModerationIntroCardProps) => (
  <div className={tw('w-[40%]')}>
    <ModerationIntroCard {...args} />
  </div>
);

export const BaseModerationIntroCard = Template.bind({});

BaseModerationIntroCard.args = {
  titleLabel: 'Overview',
  introLabel: 'Welcome to Akasha Moderation',
  subtitleLabel:
    'The Moderation app facilitates cooperation and prevents abuse. The app is open and transparent. Take part in the process of governing this community.',

  codeOfConductLabel: 'Read our Code of Conduct',
  overviewCTAArr: [
    {
      label: 'CoC discussions',
      // url: '',
      iconType: 'explore',
    },
    {
      label: 'Moderation thoughts',
      // url: '',
      iconType: 'chatBubble',
    },
    {
      label: 'Send us a message',
      // url: '',
      iconType: 'message',
    },
  ],
};
