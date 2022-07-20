import React from 'react';
import { Grommet } from 'grommet';

import SteppedActionCard, { ISteppedActionCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/SteppedActionCard',
  component: SteppedActionCard,
  argTypes: {
    titleLabel: { control: 'text' },
    activeIndex: { control: 'number' },
    handleIconClick: { action: 'icon clicked' },
  },
};

const Template = (args: ISteppedActionCardProps) => (
  <Grommet theme={lightTheme}>
    {/* <Box width="40%" pad="none" align="center"> */}
    <SteppedActionCard {...args} />
    {/* </Box> */}
  </Grommet>
);

export const BaseSteppedActionCard = Template.bind({});

BaseSteppedActionCard.args = {
  titleLabel: 'Sign Up',
  activeIndex: 2,
  stepLabels: [
    'Invitation Code',
    'Legal Agreements',
    'Choose How to Sign Up',
    'Sign Wallet Requests',
    'Choose Username',
  ],
};
