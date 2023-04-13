import React from 'react';

import Snackbar from './';

export default {
  title: 'Snackbar/Snackbar',
  component: Snackbar,
};

const Template = args => {
  const handleClick = () => {
    console.log('clicked');
  };
  return <Snackbar {...args} handleButtonClick={handleClick} handleDismiss={handleClick} />;
};

export const BaseSnackbar = Template.bind({});
BaseSnackbar.args = {
  title: 'Cooler Info Snackbar',
  description: 'Some important information will appear here',
  type: 'info',
};

export const ActionableAlertSnackbar = Template.bind({});
ActionableAlertSnackbar.args = {
  title: 'Cooler Alert Snackbar',
  description: 'Some important information will appear here',
  type: 'alert',
  actionButtonLabel: 'OK',
};

export const ActionableSuccessSnackbar = Template.bind({});
ActionableSuccessSnackbar.args = {
  title: 'Cooler Alert Snackbar',
  description: 'Some important information will appear here',
  type: 'success',
  actionButtonLabel: 'OK',
};

export const ActionableCautionSnackbar = Template.bind({});
ActionableCautionSnackbar.args = {
  title: 'Cooler Alert Snackbar',
  description: 'Some important information will appear here',
  type: 'caution',
  actionButtonLabel: 'OK',
};
