import React from 'react';
import { Box, Grommet } from 'grommet';

import MiniInfoWidgetCard, { IMiniInfoCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/MiniInfoWidgetCard',
  component: MiniInfoWidgetCard,
  argTypes: {
    handleLearnMore: { action: 'clicked learn more' },
    handleCallToAction: { action: 'clicked call to action' },
    handleDismiss: { action: 'clicked dismiss' },
  },
};

const Template = (args: IMiniInfoCardProps) => (
  <Grommet theme={lightTheme}>
    <Box width="30%" pad="none" align="center">
      <MiniInfoWidgetCard {...args} />
    </Box>
  </Grommet>
);

export const BaseMiniInfoWidgetCard = Template.bind({});

BaseMiniInfoWidgetCard.args = {
  titleLabel: 'Example title',
  subtitleLabel: 'Description of a call to action. Something to prompt the user to click',
  learnMoreLabel: 'Learn more',
  callToActionLabel: 'Do something',
};
