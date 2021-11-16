import React from 'react';
import { Box, Grommet } from 'grommet';
import { EdgeSizeType } from 'grommet/utils';

import StepIndicator, { IStepIndicatorProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Indicators/StepIndicator',
  component: StepIndicator,
  argTypes: {
    activeIndex: { control: 'number' },
    margin: { control: 'text' as EdgeSizeType },
  },
};

const Template = (args: IStepIndicatorProps) => (
  <Grommet theme={lightTheme}>
    <Box width="40%" pad="none" align="center">
      <StepIndicator {...args} />
    </Box>
  </Grommet>
);

export const BaseStepIndicator = Template.bind({});

BaseStepIndicator.args = {
  activeIndex: 2,
  stepLabels: [
    'Invitation Code',
    'Legal Agreements',
    'Choose How to Sign Up',
    'Sign Wallet Requests',
    'Choose Username',
  ],
};
