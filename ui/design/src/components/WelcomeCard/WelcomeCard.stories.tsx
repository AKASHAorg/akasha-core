import React from 'react';
import { Box, Grommet } from 'grommet';

import WelcomeCard, { IWelcomeCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/WelcomeCard',
  component: WelcomeCard,
  argTypes: {
    titleLabel: { control: 'text' },
    subtitleLabel: { control: 'text' },
    paragraphOneLabel: { control: 'text' },
    paragraphTwoIntroLabel: { control: 'text' },
    paragraphTwoBoldLabel: { control: 'text' },
    paragraphTwoNextLabel: { control: 'text' },
    paragraphThreeLabel: { control: 'text' },
  },
};

const Template = (args: IWelcomeCardProps) => (
  <Grommet theme={lightTheme}>
    <Box width="38%" pad="none" align="center">
      <WelcomeCard {...args} />
    </Box>
  </Grommet>
);

export const BaseWelcomeCard = Template.bind({});

BaseWelcomeCard.args = {
  titleLabel: 'Welcome to the alpha!',
  subtitleLabel: 'Congratulations, you are the newest member of Ethereum World!',
  paragraphOneLabel:
    'You can now browse the feed, subscribe to topics, write your own posts, and reply to other Ethereans.',
  paragraphTwoIntroLabel: 'While you don’t have to do it now,',
  paragraphTwoBoldLabel: 'we do recommend you take the time to customize your profile',
  paragraphTwoNextLabel:
    'You can change your display name and avatar, add a cover image and description, as well as claim your own AKASHA ENS name.',
  paragraphThreeLabel: 'We are very happy you’ve joined us!',
  primaryButtonLabel: 'Browse Ethereum World',
  secondaryButtonLabel: 'Customize My Profile',
};
