import React from 'react';
import { Box, Grommet } from 'grommet';

import MdCard, { IMdCard } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/MdCard',
  component: MdCard,
};

const Template = (args: IMdCard) => (
  <Grommet theme={lightTheme}>
    <Box align="center" pad={{ top: '40px' }} width="582px">
      <MdCard {...args} />
    </Box>
  </Grommet>
);

export const BaseMarkdownCard = Template.bind({});

BaseMarkdownCard.args = {
  mdText: '`**Hello**`',
};
