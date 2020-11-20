/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { IReportModalProps } from '@akashaproject/design-system/lib/components/Modals';

const {
  Box,
  ShareModal,
  Icon,
  MobileListModal,
  ReportModal,
  ToastProvider,
  ViewportSizeProvider,
  useViewportSize,
} = DS;

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

const ReportModalComponent = (props: Omit<IReportModalProps, 'closeModal'>) => {
  const {
    titleLabel,
    successTitleLabel,
    successMessageLabel,
    optionsTitleLabel,
    optionLabels,
    descriptionLabel,
    descriptionPlaceholder,
    footerText1Label,
    footerText2Label,
    footerLink1Label,
    footerLink2Label,
    footerUrl1,
    footerUrl2,
    cancelLabel,
    reportLabel,
    blockLabel,
    closeLabel,
  } = props;

  const [modalOpen, setModalOpen] = React.useState(false);

  const { size } = useViewportSize();

  return (
    <Box fill={true} justify="center" align="center">
      <Icon
        type="eye"
        onClick={() => {
          setModalOpen(true);
        }}
      />
      {modalOpen && (
        <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
          <ReportModal
            titleLabel={titleLabel}
            successTitleLabel={successTitleLabel}
            successMessageLabel={successMessageLabel}
            optionsTitleLabel={optionsTitleLabel}
            optionLabels={optionLabels}
            descriptionLabel={descriptionLabel}
            descriptionPlaceholder={descriptionPlaceholder}
            footerText1Label={footerText1Label}
            footerLink1Label={footerLink1Label}
            footerUrl1={footerUrl1}
            footerText2Label={footerText2Label}
            footerLink2Label={footerLink2Label}
            footerUrl2={footerUrl2}
            cancelLabel={cancelLabel}
            reportLabel={reportLabel}
            blockLabel={blockLabel}
            closeLabel={closeLabel}
            storybook={true}
            size={size}
            closeModal={() => {
              setModalOpen(false);
            }}
          />
        </ToastProvider>
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
storiesOf('Modals/ Report Modal', module)
  .add('Report post modal', () => (
    <ViewportSizeProvider>
      <ReportModalComponent
        titleLabel={text('Title Label', 'Report a Post')}
        successTitleLabel={text(
          'Success Title Label',
          'Thank you for helping us keep Ethereum World Safe! 🙌',
        )}
        successMessageLabel={text(
          'Success Content Label',
          'We will investigate this post and take appropriate action.',
        )}
        optionsTitleLabel={text('Subtitle Label', 'Please select a reason')}
        optionLabels={[
          text('Option 1 Label', 'Suspicious, deceptive, or spam'),
          text('Option 2 Label', 'Abusive or harmful to others'),
          text('Option 3 Label', 'Self-harm or suicide'),
          text('Option 4 Label', 'Illegal'),
          text('Option 5 Label', 'Nudity'),
          text('Option 6 Label', 'Violence'),
        ]}
        descriptionLabel={text('Explanation Label', 'Explanation')}
        descriptionPlaceholder={text('Description Placeholder', 'Please explain your reason(s)')}
        footerText1Label={text('Footer Text 1 Label', 'If you are unsure, you can refer to our')}
        footerLink1Label={text('Footer Link 1 Label', 'Code of Conduct')}
        footerUrl1={text('Footer URL 1', 'https://ethereum.world/code-of-conduct')}
        footerText2Label={text('Footer Text 2 Label', 'and')}
        footerLink2Label={text('Footer Link 2 Label', 'Terms of Service')}
        footerUrl2={text('Footer URL 2', 'https://ethereum.world/terms-of-service')}
        cancelLabel={text('Cancel Label', 'Cancel')}
        reportLabel={text('Save Label', 'Report')}
        blockLabel={text('Block User Label', 'Block User')}
        closeLabel={text('Close Label', 'Close')}
      />
    </ViewportSizeProvider>
  ))
  .add('Report account modal', () => (
    <ViewportSizeProvider>
      <ReportModalComponent
        titleLabel={text('Title Label', 'Report an Account')}
        successTitleLabel={text(
          'Success Title Label',
          'Thank you for helping us keep Ethereum World Safe! 🙌',
        )}
        successMessageLabel={text(
          'Success Content Label',
          'We will investigate this post and take appropriate action',
        )}
        optionsTitleLabel={text('Subtitle Label', 'Please select a reason')}
        optionLabels={[
          text('Option 1 Label', 'Suspicious, deceptive, or spam'),
          text('Option 2 Label', 'Abusive or harmful to others'),
          text('Option 3 Label', 'Self-harm or suicide'),
          text('Option 4 Label', 'Illegal'),
          text('Option 5 Label', 'Nudity'),
          text('Option 6 Label', 'Violence'),
        ]}
        descriptionLabel={text('Explanation Label', 'Explanation')}
        descriptionPlaceholder={text('Description Placeholder', 'Please explain your reason(s)')}
        footerText1Label={text('Footer Text 1 Label', 'If you are unsure, you can refer to our')}
        footerLink1Label={text('Footer Link 1 Label', 'Code of Conduct')}
        footerUrl1={text('Footer URL 1', 'https://ethereum.world/code-of-conduct')}
        footerText2Label={text('Footer Text 2 Label', 'and')}
        footerLink2Label={text('Footer Link 2 Label', 'Terms of Service')}
        footerUrl2={text('Footer URL 2', 'https://ethereum.world/terms-of-service')}
        cancelLabel={text('Cancel Label', 'Cancel')}
        reportLabel={text('Save Label', 'Report')}
        blockLabel={text('Block User Label', 'Block User')}
        closeLabel={text('Close Label', 'Close')}
      />
    </ViewportSizeProvider>
  ));
