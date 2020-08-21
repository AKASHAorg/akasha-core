/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

const { Box, ShareModal, Icon, MobileListModal } = DS;

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

const MobileListModalComponent = () => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const menuItems = ['All', 'Most reposted', 'Oldest', 'Latest'];

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
          menuItems={menuItems.map(item => {
            return {
              label: item,
              handler: () => {
                return;
              },
            };
          })}
          closeModal={() => {
            setModalOpen(false);
          }}
        />
      )}
    </Box>
  );
};

storiesOf('Modals/Share Modal', module).add('Share modal', () => <ShareModalComponent />);
storiesOf('Modals/List Modal', module).add('Mobile list modal', () => <MobileListModalComponent />);
