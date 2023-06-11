import React from 'react';
import { Box, Grommet } from 'grommet';

import lightTheme from '../../styles/themes/light/light-theme';
import { StartCard, StartProps } from './index';

export default {
  title: 'Cards/StartCard',
  component: StartCard,
  argTypes: {
    title: { control: 'text' },
    heading: { control: 'text' },
    description: { control: 'text' },
    image: { control: 'text' },
  },
};

const Template = (args: StartProps) => {
  return (
    <Grommet theme={lightTheme}>
      <Box pad="large" align="center">
        <StartCard {...args} />
      </Box>
    </Grommet>
  );
};

export const BaseStartCard = Template.bind({});

BaseStartCard.args = {
  title: 'Lists',
  heading: '✨ Save what inspires you ✨',
  image: 'https://placekitten.com/300/300',
  description:
    'To create your unique feed view, subscribe to your favourite topics and find wonderful people to follow in our community.',
};
