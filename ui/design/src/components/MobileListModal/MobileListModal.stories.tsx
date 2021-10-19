import React from 'react';
import { Box, Grommet } from 'grommet';

import MobileListModal from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import Icon from '../Icon';

export default {
  title: 'Modals/MobileListModal',
  component: MobileListModal,
  argTypes: {
    repostLabel: { control: 'text' },
    repostWithCommentLabel: { control: 'text' },
  },
};

const Template = (args: { repostLabel: string; repostWithCommentLabel: string }) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const menuItems = [
    {
      label: args.repostLabel,
      icon: 'transfer',
      handler: (e: React.MouseEvent) => {
        e.stopPropagation();
      },
    },
    {
      label: args.repostWithCommentLabel,
      icon: 'edit',
      handler: (e: React.MouseEvent) => {
        e.stopPropagation();
      },
    },
  ];
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
          <MobileListModal
            menuItems={menuItems}
            closeModal={() => setModalOpen(false)}
            modalSlotId={''}
          />
        )}
      </Box>
    </Grommet>
  );
};

export const BaseMobileListModal = Template.bind({});

BaseMobileListModal.args = {
  repostLabel: 'Repost',
  repostWithCommentLabel: 'Repost with comment',
};
