import React from 'react';

import ErrorLoader, { ErrorLoaderProps } from '.';

export default {
  title: 'Errors/ErrorLoader',
  component: ErrorLoader,
};

const Template = (args: ErrorLoaderProps) => <ErrorLoader {...args} />;

export const BaseErrorLoader = Template.bind({});
BaseErrorLoader.args = {
  type: 'no-login',
  title: 'No Ethereum address detected',
  details:
    'You need to login or allow access to your current Ethereum address in your Web3 Ethereum client like MetaMask, and then reload, please.',
};
