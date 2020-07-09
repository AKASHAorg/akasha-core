/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

const { Box, ShareModal, Icon } = DS;

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

storiesOf('Modals/Share Modal', module).add('Share', () => <ShareModalComponent />);
