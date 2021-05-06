import React from 'react';
import { Box, Grommet } from 'grommet';

import HorizontalDivider from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Dividers/HorizontalDivider',
  component: HorizontalDivider,
};

const Template = () => (
  <Grommet theme={lightTheme}>
    <Box fill={true} justify="center" align="center">
      <Box width="medium" pad={{ top: '120px' }}>
        <HorizontalDivider />
      </Box>
    </Box>
  </Grommet>
);

export const BaseHorizontalDivider = Template.bind({});
