import React from 'react';

import ModerationValueCard, { IModerationValueCardProps } from '.';

export default {
  title: 'Moderation/ModerationValueCard',
  component: ModerationValueCard,
};

const Template = (args: IModerationValueCardProps) => (
  <div style={{ width: '40%' }}>
    <ModerationValueCard {...args} />
  </div>
);

export const BaseModerationValueMiniCard = Template.bind({});

BaseModerationValueMiniCard.args = {
  isMini: true,
  label: 'Transparency',
  assetName: 'transparency',
};

export const BaseModerationValueCard = Template.bind({});

BaseModerationValueCard.args = {
  label: 'Transparency',
  assetName: 'transparency',
  description:
    'It needs to be easy for everyone to see what actions are performed. Our communities shall be build on tools and processes that strive for openness, communication and accountability.',
  ctaLabel: 'Discuss this value',
  ctaUrl: '',
};
