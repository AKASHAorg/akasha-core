import React from 'react';
import { Grommet } from 'grommet';

import EnsFormCard, { IEnsFormCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/EnsFormCard',
  component: EnsFormCard,
  argTypes: {
    titleLabel: { control: 'text' },
    nameLabel: { control: 'text' },
    errorLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
    saveLabel: { control: 'text' },
    options: [
      {
        type: { control: 'number' },
        label: { control: 'text' },
        value: { control: 'text' },
        defaultChecked: { control: 'boolean' },
        textDetails: { control: 'text' },
      },
    ],
    onSave: { action: 'clicked save' },
    onCancel: { action: 'clicked cancel' },
  },
};

const Template = (args: IEnsFormCardProps) => (
  <Grommet theme={lightTheme}>
    <EnsFormCard {...args} />
  </Grommet>
);

export const BaseEnsFormCard = Template.bind({});

BaseEnsFormCard.args = {
  titleLabel: 'Add a Username',
  nameLabel: 'Select a username',
  errorLabel: 'Sorry, this username has already been taken. Please choose another one.',
  cancelLabel: 'Cancel',
  saveLabel: 'Save',
  options: [
    {
      type: 0,
      label: 'Display my AKASHA Ethereum name',
      value: 'mysubdomain.akasha.eth',
      defaultChecked: false,
      textDetails: <>`Username Powered by ENS`</>,
    },
  ],
};
