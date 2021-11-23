import React from 'react';
import { Box, Grommet } from 'grommet';

import VariableIconButton, { IVariableIconButtonProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Buttons/VariableIconButton',
  component: VariableIconButton,
  argTypes: {
    titleLabel: { control: 'text' },
    handleClick: { action: 'button clicked' },
  },
};

const Template = (args: IVariableIconButtonProps) => (
  <Grommet theme={lightTheme}>
    <Box width="30%" pad="none" align="center">
      <VariableIconButton {...args} />
    </Box>
  </Grommet>
);

export const BaseVariableIconButton = Template.bind({});

BaseVariableIconButton.args = {
  titleLabel: 'Select Address in Wallet',
};
