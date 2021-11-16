import React from 'react';
import { Grommet } from 'grommet';

import SignUpCard, { ISignUpCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/SignUpCard',
  component: SignUpCard,
  argTypes: {
    titleLabel: { control: 'text' },
    activeIndex: { control: 'number' },
    handleIconClick: { action: 'icon clicked' },
  },
};

const Template = (args: ISignUpCardProps) => (
  <Grommet theme={lightTheme}>
    {/* <Box width="40%" pad="none" align="center"> */}
    <SignUpCard {...args} />
    {/* </Box> */}
  </Grommet>
);

export const BaseSignUpCard = Template.bind({});

BaseSignUpCard.args = {
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
