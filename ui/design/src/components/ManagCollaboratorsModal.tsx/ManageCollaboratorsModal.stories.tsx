import React from 'react';
import { Box, Grommet } from 'grommet';

import ManageCollaboratorsModal from '.';
import { IManageCollaboratorsModalProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import Icon from '../Icon';

export default {
  title: 'Modals/ManageCollaboratorsModal',
  component: ManageCollaboratorsModal,
  argTypes: {
    titleLabel: { control: 'text' },
    closeModal: { action: 'modal closed' },
  },
};

const Template = (args: IManageCollaboratorsModalProps) => {
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
        {modalOpen && <ManageCollaboratorsModal {...args} closeModal={() => setModalOpen(false)} />}
      </Box>
    </Grommet>
  );
};

export const BaseManageCollaboratorsModal = Template.bind({});

BaseManageCollaboratorsModal.args = {
  titleLabel: 'Collaborators',
};
