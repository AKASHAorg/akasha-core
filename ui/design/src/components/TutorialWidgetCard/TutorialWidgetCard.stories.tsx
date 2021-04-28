import React from 'react';
import { Box, Grommet } from 'grommet';

import TutorialWidgetCard, { ITutorialWidgetCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/TutorialWidgetCard',
  component: TutorialWidgetCard,
  argType: {
    currentProgress: { control: 'text' },

    handleSeeVideoTutorial: { action: 'clicked see video' },
    handleDismiss: { action: 'clicked dismiss' },
  },
};

const Template = (args: ITutorialWidgetCardProps) => (
  <Grommet theme={lightTheme}>
    <Box width="30%" pad="none" align="center">
      <TutorialWidgetCard {...args} />
    </Box>
  </Grommet>
);

export const BaseTutorialWidgetCard = Template.bind({});

BaseTutorialWidgetCard.args = {
  currentProgress: 0,
  titleLabel: 'Pick your ethereum name',
  subtitleLabel: 'Take your address to the next level',
  infoLabel:
    'Your human-friendly Ethereum name can be used also in wallets instead of your address',

  subtitleIcon: 'iconEns',
  seeVideoTutorialLabel: 'See video tutorial',
  callToActionLabel: 'Go to app',
  learnMoreLabel: 'Learn more',
};
