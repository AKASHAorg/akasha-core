import React from 'react';
import { Box, Grommet } from 'grommet';

import ReportModal from '.';
import { IReportModalProps } from './report-modal';

import lightTheme from '../../styles/themes/light/light-theme';
import Icon from '../Icon';
import ReportSuccessModal, { IReportSuccessModalProps } from './report-success-modal';

export default {
  title: 'Modals/ReportModal',
  component: ReportModal,
  argTypes: {
    titleLabel: { control: 'text' },
    successTitleLabel: { control: 'text' },
    successMessageLabel: { control: 'text' },
    reasonPrefix: { control: 'text' },
    contentId: { control: 'text' },
    footerLabel: { control: 'text' },
    footerCTAUrl: { control: 'text' },
    footerCTALabel: { control: 'text' },
    optionsTitleLabel: { control: 'text' },
    optionLabels: [{ control: 'text' }],
    optionValues: [{ control: 'text' }],
    reason: { control: 'text' },
    descriptionLabel: { control: 'text' },
    descriptionPlaceholder: { control: 'text' },
    explanation: { control: 'text' },
    footerText1Label: { control: 'text' },
    footerLink1Label: { control: 'text' },
    footerUrl1: { control: 'text' },
    footerText2Label: { control: 'text' },
    footerLink2Label: { control: 'text' },
    footerUrl2: { control: 'text' },
    cancelLabel: { control: 'text' },
    reportLabel: { control: 'text' },
    blockLabel: { control: 'text' },
    closeLabel: { control: 'text' },
    requesting: { control: 'boolean' },
    success: { control: 'boolean' },

    setReason: { action: 'reason set' },
    setExplanation: { action: 'explanation set' },
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
        {modalOpen && <ReportModal {...args} closeModal={() => setModalOpen(false)} />}
      </Box>
    </Grommet>
  );
};

const Template2 = (args: IReportSuccessModalProps) => {
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
        {modalOpen && <ReportSuccessModal {...args} closeModal={() => setModalOpen(false)} />}
      </Box>
    </Grommet>
  );
};

export const BaseReportModal = Template.bind({});

BaseReportModal.args = {
  titleLabel: 'Report a Post',
  successTitleLabel: 'Thank you for helping us keep Akasha World safe! 🙌',
  successMessageLabel: 'We have received your message',
  reasonPrefix: 'OT',
  contentId: '0845',
  footerLabel: 'Feel like you want to contribute more to improve our community?',
  footerCTAUrl: 'https://discord.gg/A5wfg6ZCRt',
  footerCTALabel: 'Join our Moderation Discord channel',
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
  reason: 'Other',
  descriptionLabel: 'Explanation',
  descriptionPlaceholder: 'Please explain your reason(s)',
  explanation: 'some explanation',
  footerText1Label: 'If you are unsure, you can refer to our',
  footerLink1Label: 'Code of Conduct',
  footerUrl1: 'https://akasha.ethereum.world/legal/code-of-conduct',
  footerText2Label: 'and',
  footerLink2Label: 'Terms of Service',
  footerUrl2: 'https://akasha.ethereum.world/legal/terms-of-service',
  cancelLabel: 'Cancel',
  reportLabel: 'Report',
  requesting: false,
  success: false,
};

export const BaseReportSuccessModal = Template2.bind({});

BaseReportSuccessModal.args = {
  successTitleLabel: 'Thank you for helping us keep Akasha World safe! 🙌',
  successMessageLabel: 'We have received your message',
  reason: 'Other',
  reasonPrefix: 'OT',
  contentId: '0845',
  footerLabel: 'Feel like you want to contribute more to improve our community?',
  footerCTAUrl: 'https://discord.gg/A5wfg6ZCRt',
  footerCTALabel: 'Join our Moderation Discord channel',
};
