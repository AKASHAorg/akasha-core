import React from 'react';
import { Box, Grommet } from 'grommet';

import ShareModal, { IShareModal } from '.';

import Icon from '../Icon';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Modals/ShareModal',
  component: ShareModal,
  argTypes: {
    link: { control: 'text' },
    copyLabel: { control: 'text' },
    shareTitleLabel: { control: 'text' },
    shareSubtitleLabel: { control: 'text' },
    shareSocialLabel: { control: 'text' },
    handleProfileShare: {
      action: 'profile shared',
    },
  },
};

const Template = (args: IShareModal) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  return (
    <Grommet theme={lightTheme}>
      <Box fill={true} justify="center" align="center">
        <Icon
          type="share"
          onClick={() => {
            setModalOpen(true);
          }}
        />
        {modalOpen && <ShareModal {...args} closeModal={() => setModalOpen(false)} />}
      </Box>
    </Grommet>
  );
};

export const BaseShareModal = Template.bind({});

BaseShareModal.args = {
  link: 'ethereum.world/gilbert',
  copyLabel: 'Copy',
  shareTitleLabel: 'Share the profile',
  shareSubtitleLabel: 'Share a profile by copying the link below',
  shareSocialLabel: 'Or share it on every social platform',
};
