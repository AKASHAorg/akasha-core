import React from 'react';
import { Box, Grommet } from 'grommet';

import SelectAddressButton, { ISelectAddressButtonProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Buttons/SelectAddressButton',
  component: SelectAddressButton,
  argTypes: {
    titleLabel: { control: 'text' },
    handleClick: { action: 'button clicked' },
  },
};

const Template = (args: ISelectAddressButtonProps) => (
  <Grommet theme={lightTheme}>
    <Box width="30%" pad="none" align="center">
      <SelectAddressButton {...args} />
    </Box>
  </Grommet>
);

export const BaseSelectAddressButton = Template.bind({});

BaseSelectAddressButton.args = {
  titleLabel: 'Select Address in Wallet',
};
