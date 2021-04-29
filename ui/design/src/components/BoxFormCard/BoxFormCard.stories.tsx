import React from 'react';
import { Grommet } from 'grommet';

import BoxFormCard from '.';

import lightTheme from '../../styles/themes/light/light-theme';

import { boxProviderData } from '../../utils/dummy-data';

export default {
  title: 'Cards/BoxFormCard',
  component: BoxFormCard,
  argTypes: {
    nameLabel: { control: 'text' },
    saveLabel: { control: 'text' },
    urlLabel: { control: 'text' },
    avatarLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
    deleteLabel: { control: 'text' },
    coverImageLabel: { control: 'text' },
    uploadLabel: { control: 'text' },
    titleLabel: { control: 'text' },
    descriptionLabel: { control: 'text' },
    nameFieldPlaceholder: { control: 'text' },
    descriptionFieldPlaceholder: { control: 'text' },
    ethAddress: { control: 'text' },
    onSave: { action: 'clicked save' },
    onCancel: { action: 'clicked cancel' },
  },
};

const Template = (args: any) => (
  <Grommet theme={lightTheme}>
    <BoxFormCard {...args} />
  </Grommet>
);

export const BaseBoxFormCard = Template.bind({});

BaseBoxFormCard.args = {
  nameLabel: 'Name',
  saveLabel: 'Save',
  urlLabel: 'By url',
  avatarLabel: 'Avatar',
  cancelLabel: 'Cancel',
  deleteLabel: 'Delete Image',
  coverImageLabel: 'Cover Image',
  uploadLabel: 'Upload an image',
  titleLabel: 'Ethereum Address',
  descriptionLabel: 'Description',
  nameFieldPlaceholder: 'Type your name here',
  descriptionFieldPlaceholder: 'Add a description about you here',
  ethAddress: '0x003410499401674320006570047391024572456',
  providerData: boxProviderData,
  updateStatus: { saving: false },
  onSave: () => null,
  onCancel: () => null,
};
