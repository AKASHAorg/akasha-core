import React from 'react';

import ErrorCard, { IErrorCardProps } from '.';

export default {
  title: 'Cards/ErrorCard',
  component: ErrorCard,
};

const Template = (args: IErrorCardProps) => <ErrorCard {...args} />;

export const BaseErrorCard = Template.bind({});

BaseErrorCard.args = {
  boxSize: '18.75rem',
  errorType: 'no-authentication',
  titleLabel: 'This page is for our marvelous Akasha World moderators',
  subtitleLabel:
    'To view this page, you must be an Akasha World Moderator and log in with your wallet to continue.',
  buttonLabel: 'Connect a wallet',
  textMarginBottom: true,
  hasButton: true,
};
