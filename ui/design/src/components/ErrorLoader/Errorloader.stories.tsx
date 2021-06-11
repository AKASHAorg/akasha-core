import React from 'react';
import { Grommet } from 'grommet';

import ErrorLoader from '.';
import { ErrorLoaderProps } from './interfaces';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Errors/ErrorLoader',
  component: ErrorLoader,
};

const Template = (args: ErrorLoaderProps) => (
  <Grommet theme={lightTheme}>
    <ErrorLoader {...args} />
  </Grommet>
);

export const BaseErrorLoader = Template.bind({});
BaseErrorLoader.args = {
  type: 'no-login',
  title: 'No Ethereum address detected',
  details:
    'You need to login or allow access to your current Ethereum address in your Web3 Ethereum client like MetaMask, and then reload, please.',
};
