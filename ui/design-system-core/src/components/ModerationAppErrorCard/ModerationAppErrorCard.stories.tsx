import React from 'react';

import ModerationAppErrorCard from '.';

import { IModerationAppErrorCardProps } from '../../interfaces/moderationAppErrorCard';

export default {
  title: 'Errors/ModerationAppErrorCard',
  component: ModerationAppErrorCard,
};

const Template = (args: IModerationAppErrorCardProps) => <ModerationAppErrorCard {...args} />;

export const BaseModerationAppErrorCard = Template.bind({});

BaseModerationAppErrorCard.args = {
  boxSize: '18.75rem',
  errorType: 'no-authentication',
  titleLabel: 'This page is for our marvelous Akasha World moderators',
  subtitleLabel:
    'To view this page, you must be an Akasha World Moderator and log in with your wallet to continue.',
  buttonLabel: 'Connect a wallet',
  textMarginBottom: true,
  hasButton: true,
};
