import React from 'react';
import { Box, Grommet } from 'grommet';
import { ToastProvider } from 'react-toast-notifications';

import ReportModal from '.';
import { IReportModalProps } from './report-modal';

import lightTheme from '../../styles/themes/light/light-theme';
import Icon from '../Icon';

export default {
  title: 'Modals/ReportModal',
  component: ReportModal,
  argTypes: {
    titleLabel: { control: 'text' },
    successTitleLabel: { control: 'text' },
    successMessageLabel: { control: 'text' },
    optionsTitleLabel: { control: 'text' },
    optionLabels: [{ control: 'text' }],
    optionValues: [{ control: 'text' }],
    descriptionLabel: { control: 'text' },
    descriptionPlaceholder: { control: 'text' },
    footerText1Label: { control: 'text' },
    footerLink1Label: { control: 'text' },
    footerUrl1: { control: 'text' },
    cancelLabel: { control: 'text' },
    reportLabel: { control: 'text' },
    blockLabel: { control: 'text' },
    closeLabel: { control: 'text' },
    closeModal: { action: 'modal closed' },
  },
};

const Template = (args: IReportModalProps) => {
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
            <ReportModal {...args} closeModal={() => setModalOpen(false)} />
          </ToastProvider>
        )}
      </Box>
    </Grommet>
  );
};

export const BaseReportModal = Template.bind({});

BaseReportModal.args = {
  titleLabel: 'Report a Post',
  successTitleLabel: 'Thank you for helping us keep Ethereum World safe! 🙌',
  successMessageLabel: 'We will investigate this post and take appropriate action.',
  optionsTitleLabel: 'Please select a reason',
  optionLabels: [
    'Suspicious, deceptive, or spam',
    'Abusive or harmful to others',
    'Self-harm or suicide',
    'Illegal',
    'Nudity',
    'Violence',
  ],
  optionValues: [
    'Suspicious, deceptive, or spam',
    'Abusive or harmful to others',
    'Self-harm or suicide',
    'Illegal',
    'Nudity',
    'Violence',
  ],
  descriptionLabel: 'Explanation',
  descriptionPlaceholder: 'Please explain your reason(s)',
  footerText1Label: 'If you are unsure, you can refer to our',
  footerLink1Label: 'Code of Conduct',
  footerUrl1: 'https://ethereum.world/code-of-conduct',
  cancelLabel: 'Cancel',
  reportLabel: 'Report',
  blockLabel: 'Block User',
  closeLabel: 'Close',
};
