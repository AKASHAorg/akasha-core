import React from 'react';
import { Grommet } from 'grommet';

import lightTheme from '../../styles/themes/light/light-theme';
import ScrollTopButton, { ScrollTopButtonProps } from '.';

export default {
  title: 'Buttons/ScrollTopButton',
  component: ScrollTopButton,
};

const Template = (args: ScrollTopButtonProps) => (
  <Grommet theme={lightTheme}>
    <ScrollTopButton {...args} />
  </Grommet>
);

export const BaseScrollTopButton = Template.bind({});
