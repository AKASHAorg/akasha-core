import React from 'react';
import { Box, Grommet } from 'grommet';

import lightTheme from '../../styles/themes/light/light-theme';
import InfoCard, { InfoProps } from './index';

export default {
  title: 'Cards/InfoCard',
  component: InfoCard,
  argTypes: {
    icon: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    suggestion: { control: 'text' },
  },
};

const Template = (args: InfoProps) => {
  return (
    <Grommet theme={lightTheme}>
      <Box pad="large" align="center">
        <InfoCard {...args} />
      </Box>
    </Grommet>
  );
};

export const BaseSubtitleTextIcon = Template.bind({});

BaseSubtitleTextIcon.args = {
  icon: 'search',
  title: 'No matching results found',
  description: '',
  suggestion: 'Make sure you spelled everything correctly',
};
