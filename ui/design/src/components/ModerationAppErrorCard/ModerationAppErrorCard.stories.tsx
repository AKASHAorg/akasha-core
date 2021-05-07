import React from 'react';
import { Grommet } from 'grommet';

import ModerationAppErrorCard, { IModerationAppErrorCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Errors/ModerationAppErrorCard',
  component: ModerationAppErrorCard,
  argTypes: {
    buttonLabel: { control: 'text' },
    textMarginBottom: { control: 'boolean' },
    hasButton: { control: 'boolean' },
    showLoginmodal: { action: 'clicked connect wallet' },
  },
};

const Template = (args: IModerationAppErrorCardProps) => (
  <Grommet theme={lightTheme}>
    <ModerationAppErrorCard {...args} />
  </Grommet>
);

export const BaseModerationAppErrorCard = Template.bind({});
BaseModerationAppErrorCard.args = {
  size: '18.75rem',
  errorType: 'no-authentication',
  titleLabel: 'This page is restricted to Ethereum World Moderators',
  subtitleLabel:
    'To view this page, you must be an Ethereum World Moderator and log in with your wallet to continue.',
  buttonLabel: 'Connect a wallet',
  textMarginBottom: true,
  hasButton: true,
};
