import React from 'react';
import { Box, Grommet } from 'grommet';

import lightTheme from '../../styles/themes/light/light-theme';
import { SearchStartCard, SearchStartProps } from './index';

export default {
  title: 'Cards/SearchStartCard',
  component: SearchStartCard,
  argTypes: {
    searchKeywordParam: { control: 'text' },
    inputPlaceholderLabel: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    image: { control: 'text' },
  },
};

const Template = (args: SearchStartProps) => {
  return (
    <Grommet theme={lightTheme}>
      <Box pad="large" align="center">
        <SearchStartCard {...args} />
      </Box>
    </Grommet>
  );
};

export const BaseSearchStartCard = Template.bind({});

BaseSearchStartCard.args = {
  searchKeywordParam: '',
  inputPlaceholderLabel: 'Search',
  titleLabel: 'Search',
  subtitleLabel: '✨ Find what you are looking for ✨',
  description:
    'To create your unique feed view, subscribe to your favourite topics and find wonderful people to follow in our community.',
};
