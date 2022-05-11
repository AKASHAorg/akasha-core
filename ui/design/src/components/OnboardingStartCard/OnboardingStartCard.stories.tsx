import React from 'react';
import { Box, Grommet } from 'grommet';

import lightTheme from '../../styles/themes/light/light-theme';
import { OnboardingStartCard, OnboardingStartCardProps } from './index';

export default {
  title: 'Cards/OnboardingStartCard',
  component: OnboardingStartCard,
  argTypes: {
    searchKeyword: { control: 'text' },
    inputPlaceholderLabel: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    image: { control: 'text' },
  },
};

const Template = (args: OnboardingStartCardProps) => {
  return (
    <Grommet theme={lightTheme}>
      <Box pad="large" align="center">
        <OnboardingStartCard {...args} />
      </Box>
    </Grommet>
  );
};

export const BaseOnboardingStartCard = Template.bind({});

BaseOnboardingStartCard.args = {
  inputPlaceholderLabel: 'Search',
  titleLabel: 'Search',
};
