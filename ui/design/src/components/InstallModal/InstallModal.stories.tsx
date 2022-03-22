import React from 'react';
import { Grommet } from 'grommet';

import InstallModal, { InstallModalProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Modals/InstallModal',
  component: InstallModal,
  argTypes: {
    onCloseModal: { action: 'close modal click' },
    integrationName: { control: 'text' },
    cancelLabel: { control: 'text' },
    continueLabel: { control: 'text' },
    cancelTitleLabel: { control: 'text' },
    cancelSubtitleLabel: { control: 'text' },
    doneLabel: { control: 'text' },
    dismissLabel: { control: 'text' },
    modalTitleLabel: { control: 'text' },
    installTitleLabel1: { control: 'text' },
    installTitleLabel2: { control: 'text' },
    installStep: { control: 'number' },
    savingInfoLabel: { control: 'text' },
    downloadingResourcesLabel: { control: 'text' },
    successTitleLabel: { control: 'text' },
    successInfoLabel: { control: 'text' },
    successSubInfoLabel: { control: 'text' },
    successSubtitleLabel: { control: 'text' },
    errorInfoLabel: { control: 'text' },
    errorSubInfoLabel: { control: 'text' },
    errorSubtitleLabel: { control: 'text' },
    errorTitleLabel: { control: 'text' },
    error: { control: 'text' },
  },
};

const Template = (args: InstallModalProps) => (
  <Grommet theme={lightTheme}>
    <InstallModal {...args} />
  </Grommet>
);

export const BaseInstallModal = Template.bind({});
BaseInstallModal.args = {
  error: null,
  cancelLabel: 'Cancel',
  continueLabel: 'Continue',
  cancelTitleLabel: 'Cancel installation',
  cancelSubtitleLabel: 'Are you sure you want to cancel the installation?',
  doneLabel: 'Done',
  dismissLabel: 'Dismiss',
  modalTitleLabel: 'App Install',
  integrationName: 'Moderation Tools App',
  installTitleLabel1: 'To add',
  installTitleLabel2:
    'to your World we have to do a few things first. This will take less than a minute.',
  installStep: 1,
  savingInfoLabel: 'Saving install information',
  downloadingResourcesLabel: 'Downloading resources',
  successTitleLabel: 'Done!',
  successInfoLabel:
    'To check out your new app visit the Integration centre and look under Your Apps. You can also open the side bar menu.',
  successSubInfoLabel: 'Enjoy!',
  successSubtitleLabel:
    'Moderating Tools App is now installed in Ethereum World, and is currently active.',
  errorInfoLabel: 'Please check your network connection and try again.',
  errorSubInfoLabel: 'Thank you!',
  errorSubtitleLabel: 'could not be installed in Ethereum World.',
  errorTitleLabel: 'Oops!',
};
