import React from 'react';
import { Grommet } from 'grommet';

import ModerationIntroCard, { IModerationIntroCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/ModerationIntroCard',
  component: ModerationIntroCard,
  argTypes: {
    buttonLabel: { control: 'text' },
    textMarginBottom: { control: 'boolean' },
    hasButton: { control: 'boolean' },
    showLoginmodal: { action: 'clicked connect wallet' },
  },
};

const Template = (args: IModerationIntroCardProps) => (
  <Grommet theme={lightTheme}>
    <ModerationIntroCard {...args} />
  </Grommet>
);

export const BaseModerationIntroCard = Template.bind({});
BaseModerationIntroCard.args = {
  titleLabel: 'Moderating',
  subtitleLabel: 'Find all the moderated posts, replies and accounts',
  isIntro: true,
  introLabel: 'Welcome to the Moderation App',
  descriptionLine1Label:
    'Here you will find the moderated posts, replies, and accounts of Akasha World. We do not reveal any personal information of the author or submitter(s) to protect their privacy.',
  descriptionLine2IntroLabel: 'Visit our',
  codeOfConductLabel: 'Code of Conduct',
  descriptionLine2Label: 'to learn more about our moderation criteria',
};
