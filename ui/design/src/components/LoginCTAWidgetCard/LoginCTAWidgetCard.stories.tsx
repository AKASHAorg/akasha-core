import React from 'react';
import { Box, Grommet } from 'grommet';

import LoginCTAWidgetCard, { ILoginWidgetCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/LoginCTAWidgetCard',
  component: LoginCTAWidgetCard,
};

const Template = (args: ILoginWidgetCardProps) => (
  <Grommet theme={lightTheme}>
    <Box width="35%" pad="none" align="center">
      <LoginCTAWidgetCard {...args} />
    </Box>
  </Grommet>
);

export const BaseLoginCTAWidgetCard = Template.bind({});

BaseLoginCTAWidgetCard.args = {
  title: '🚀 Welcome to Ethereum World!',
  subtitle: 'We are in private alpha at this time. ',
  beforeLinkLabel: "If you'd like to participate,",
  afterLinkLabel: "and we'll add you to our waitlist!",
  writeToUsLabel: 'write to us',
  writeToUsUrl: 'mailto:alpha@ethereum.world',
};
