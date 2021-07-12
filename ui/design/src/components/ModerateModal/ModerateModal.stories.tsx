import React from 'react';
import { Box, Grommet } from 'grommet';
import { ToastProvider } from 'react-toast-notifications';

import ModerateModal from '.';
import { IModerateModalProps } from './moderate-modal';

import lightTheme from '../../styles/themes/light/light-theme';
import Icon from '../Icon';

export default {
  title: 'Modals/ModerateModal',
  component: ModerateModal,
  argTypes: {
    titleLabel: { control: 'text' },
    altTitleLabel: { control: 'text' },
    decisionLabel: { control: 'text' },
    optionLabels: [{ control: 'text' }],
    optionValues: [{ control: 'text' }],
    descriptionLabel: { control: 'text' },
    descriptionPlaceholder: { control: 'text' },
    footerText1Label: { control: 'text' },
    footerLink1Label: { control: 'text' },
    footerUrl1: { control: 'text' },
    cancelLabel: { control: 'text' },
    user: { control: 'text' },
    isReview: { control: 'boolean' },
    closeModal: { action: 'modal closed' },
    onModerate: { action: 'item moderated' },
  },
};

const Template = (args: IModerateModalProps) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <Grommet theme={lightTheme}>
      <Box fill={true} justify="center" align="center">
        <Icon
          type="eye"
          onClick={() => {
            setModalOpen(true);
          }}
        />
        {modalOpen && (
          <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
            <ModerateModal {...args} closeModal={() => setModalOpen(false)} />
          </ToastProvider>
        )}
      </Box>
    </Grommet>
  );
};

export const BaseModerateModal = Template.bind({});

BaseModerateModal.args = {
  titleLabel: 'Make a Decision',
  altTitleLabel: 'Review a Decision',
  decisionLabel: 'Decision',
  optionLabels: ['Delist', 'Keep'],
  optionValues: ['Delist', 'Keep'],
  descriptionLabel: 'Evaluation',
  descriptionPlaceholder: 'Please explain the reason(s)',
  footerText1Label: 'If you are unsure, you can refer to our',
  footerLink1Label: 'Code of Conduct',
  footerUrl1: '/legal/code-of-conduct',
  cancelLabel: 'Cancel',
  user: '0x003410490050000320006570034567114572000',
  requesting: false,
  isReview: false,
};
