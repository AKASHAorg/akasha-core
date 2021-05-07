import React from 'react';
import { Grommet } from 'grommet';

import ProfileCompletedModal, { IProfileCompletedModalProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Modals/ProfileCompletedModal',
  component: ProfileCompletedModal,
  argTypes: {
    titleLabel: { control: 'text' },
    subtitleLabel: { control: 'text' },
    buttonLabel: { control: 'text' },
    onClick: {
      action: 'clicked',
    },
  },
};

const Template = (args: IProfileCompletedModalProps) => {
  return (
    <Grommet theme={lightTheme}>
      <ProfileCompletedModal {...args} />
    </Grommet>
  );
};

export const BaseProfileCompletedModal = Template.bind({});

BaseProfileCompletedModal.args = {
  titleLabel: 'Welcome to the alpha!🙌',
  subtitleLabel: 'So happy to see you! Thank you for being part of this adventure! 🚀',
  buttonLabel: "Let's rock",
};
