/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

const { Box, ShareModal, Icon, MobileListModal, ReportPostModal } = DS;

const ShareModalComponent = () => {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <Box fill={true} justify="center" align="center">
      <Icon
        type="share"
        onClick={() => {
          setModalOpen(true);
        }}
      />
      {modalOpen && (
        <ShareModal
          profileLink={text('Link', 'ethereum.world/gilbert')}
          closeModal={() => setModalOpen(false)}
          copyLabel="Copy"
          shareTitleLabel="Share the profile"
          shareSubtitleLabel="Share a profile by copying the link below"
          shareSocialLabel="Or share it on every social platform"
        />
      )}
    </Box>
  );
};

interface IMobileListModalProps {
  repostLabel: string;
  repostWithCommentLabel: string;
}

const MobileListModalComponent = ({
  repostLabel,
  repostWithCommentLabel,
}: IMobileListModalProps) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const menuItems = [
    {
      label: repostLabel,
      icon: 'transfer',
      handler: (e: any) => {
        e.stopPropagation();
      },
    },
    {
      label: repostWithCommentLabel,
      icon: 'edit',
      handler: (e: any) => {
        e.stopPropagation();
      },
    },
  ];

  return (
    <Box fill={true} justify="center" align="center">
      <Icon
        type="eye"
        onClick={() => {
          setModalOpen(true);
        }}
      />
      {modalOpen && (
        <MobileListModal
          menuItems={menuItems}
          closeModal={() => {
            setModalOpen(false);
          }}
        />
      )}
    </Box>
  );
};

storiesOf('Modals/Share Modal', module).add('Share modal', () => <ShareModalComponent />);
storiesOf('Modals/List Modal', module).add('Mobile list modal', () => (
  <MobileListModalComponent
    repostLabel={text('Repost Label', 'Repost')}
    repostWithCommentLabel={text('Repost With Comment Label', 'Repost with comment')}
  />
));
storiesOf('Modals/ Report Modal', module).add('Report post modal', () => (
  <ReportPostModal
    titleLabel={text('Title Label', 'Report a Post')}
    optionsTitleLabel={text('Subtitle Label', 'Please select a reason')}
    option1Label={text('Option 1 Label', 'Suspicious, deceptive, or spam')}
    option2Label={text('Option 2 Label', 'Abusive or harmful to others')}
    option3Label={text('Option 3 Label', 'Self-harm or suicide')}
    option4Label={text('Option 4 Label', 'Illegal')}
    option5Label={text('Option 5 Label', 'Nudity')}
    option6Label={text('Option 6 Label', 'Violence')}
    descriptionLabel={text('Description Label', 'Description')}
    descriptionPlaceholder={text('Description Placeholder', 'Please describe the issue')}
    footerText1Label={text('Footer Text 1 Label', 'If you are unsure, you can refer to our ')}
    footerLink1Label={text('Footer Link 1 Label', 'Code of Conduct')}
    footerUrl1={text('Footer URL 1', 'https://ethereum.world/code-of-conduct')}
    footerText2Label={text('Footer Text 2 Label', ' and ')}
    footerLink2Label={text('Footer Link 2 Label', 'Terms of Service')}
    footerUrl2={text('Footer URL 2', 'https://ethereum.world/terms-of-service')}
    cancelLabel={text('Cancel Label', 'Cancel')}
    reportLabel={text('Save Label', 'Report')}
  />
));
