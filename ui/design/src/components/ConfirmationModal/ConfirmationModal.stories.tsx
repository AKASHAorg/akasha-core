import React from 'react';
import { Box, Grommet } from 'grommet';

import ConfirmationModal, { ConfirmationModalProps } from './';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Modals/ConfirmationModal',
  component: ConfirmationModal,
  argTypes: {
    onConfirm: { action: 'clicked accept all' },
    onCancel: { action: 'clicked accept only essential' },
    onClose: { action: 'clicked close, modal will now close!' },
  },
};

const Template = (args: ConfirmationModalProps) => (
  <Grommet theme={lightTheme}>
    <Box width="30%" pad="none" align="center">
      <ConfirmationModal {...args} />
    </Box>
  </Grommet>
);

export const BaseConfirmationModal: { args: ConfirmationModalProps } = Template.bind({});

BaseConfirmationModal.args = {
  modalTitle: 'Delete post',
  textDetails: 'Are you sure you want to perform this action?',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  closeLabel: 'Close',
  errors: {},
  onClose: () => {
    /* clicked! */
  },
  onConfirm: () => {
    /* clicked! */
  },
  onCancel: () => {
    /* clicked! */
  },
};
