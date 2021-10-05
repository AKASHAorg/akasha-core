import React from 'react';
import { Box, Grommet } from 'grommet';

import FeedbackModal, { IFeedbackModalProps } from '.';

import Icon from '../Icon';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Modals/FeedbackModal',
  component: FeedbackModal,
  argTypes: {
    titleLabel: { control: 'text' },
    subtitleLabel: { control: 'text' },
    openAnIssueLabel: { control: 'text' },
    emailUsLabel: { control: 'text' },
    footerTextLabel: { control: 'text' },
    footerLinkText1Label: { control: 'text' },
    footerLinkText2Label: { control: 'text' },
    openIssueLink: { control: 'text' },
    emailUsLink: { control: 'text' },
    joinDiscordLink: { control: 'text' },
    onOpenAnIssueClick: { action: 'clicked open an issue' },
    onEmailUsClick: { action: 'clicked email us' },
    onJoinDiscordClick: { action: 'clicked join discord' },
    closeModal: { action: 'modal closed' },
  },
};

const Template = (args: IFeedbackModalProps) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleCloseModal = () => {
    args.closeModal();
    setModalOpen(false);
  };

  return (
    <Grommet theme={lightTheme}>
      <Box fill={true} justify="center" align="center">
        <Icon
          type="eye"
          onClick={() => {
            setModalOpen(true);
          }}
        />
        {modalOpen && <FeedbackModal {...args} closeModal={handleCloseModal} />}
      </Box>
    </Grommet>
  );
};

export const BaseFeedbackModal = Template.bind({});

BaseFeedbackModal.args = {
  titleLabel: "We'd love to hear your feedback!",
  subtitleLabel: 'If you find any bugs or problems, please let us know',
  openAnIssueLabel: 'Open an Issue',
  emailUsLabel: 'Email Us',
  footerTextLabel:
    'Join our Discord channel to meet everyone, say "Hello!", provide feedback and share ideas.',
  footerLinkText1Label: 'Join in',
  footerLinkText2Label: 'Discord',
};
