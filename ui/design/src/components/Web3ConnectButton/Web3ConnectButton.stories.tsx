import React from 'react';
import { Box, Grommet } from 'grommet';

import Web3ConnectButton, { IWeb3ConnectButtonProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Buttons/Web3ConnectButton',
  component: Web3ConnectButton,
  argTypes: {
    titleLabel: { control: 'text' },
    subtitleLabel: { control: 'text' },
    leftIconType: { control: 'text' },
    handleClick: { action: 'button clicked' },
  },
};

const Template = (args: IWeb3ConnectButtonProps) => (
  <Grommet theme={lightTheme}>
    <Box width="30%" pad="none" align="center">
      <Web3ConnectButton {...args} />
    </Box>
  </Grommet>
);

export const BaseWeb3ConnectButton = Template.bind({});

BaseWeb3ConnectButton.args = {
  titleLabel: 'Connect a Wallet',
  subtitleLabel:
    "Use this option to sign up using your Ethereum wallet. You'll be able to choose which wallet to connect in the next screen.",
  leftIconType: 'wallet',
  tagLabel: 'auto-detected',
};
