import React from 'react';
import { Box, Grommet } from 'grommet';

import lightTheme from '../../styles/themes/light/light-theme';
import { OnboardingSuggestionsCard, OnboardingSuggestionsCardProps } from './index';

export default {
  title: 'Cards/OnboardingSuggestionsCard',
  component: OnboardingSuggestionsCard,
  argTypes: {
    title: { control: 'text' },
  },
};

const Template = (args: OnboardingSuggestionsCardProps) => {
  return (
    <Grommet theme={lightTheme}>
      <Box pad="large" align="center">
        <OnboardingSuggestionsCard {...args} />
      </Box>
    </Grommet>
  );
};

export const BaseOnboardingSuggestionsCard = Template.bind({});

BaseOnboardingSuggestionsCard.args = {
  topicsLabel: 'TOPICS TO FOLLOW',
  peopleLabel: 'PEOPLE TO FOLLOW',
};
