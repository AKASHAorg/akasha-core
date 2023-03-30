import React from 'react';
import { General, GeneralProps } from '.';

export default {
  title: 'Profile/GeneralForm',
  component: General,
};

const ethAddress = '0x003410490050000320006570034567114572000';

const Template = (args: GeneralProps) => <General {...args} />;

export const BaseGeneralForm = Template.bind({});
BaseGeneralForm.args = {
  header: {
    label: 'Avatar & Cover Image',
    coverImage: { url: 'https://static.licdn.com/sc/h/55k1z8997gh8dwtihm11aajyq' },
    avatar: { url: 'https://placebeard.it/360x360' },
    ethAddress,
  },
  name: { label: 'Name', initialValue: 'Mr. Snowman' },
  userName: { label: 'Username', initialValue: 'snowman' },
  ens: {
    label: 'ENS Name',
    initialValue: 'snowman.eth',
  },
  ensButton: {
    label: 'Fill info from ENS data',
    handleClick: () => ({}),
  },
  cancelButton: {
    label: 'Cancel',
    handleClick: () => ({}),
  },
  saveButton: {
    label: 'Save',
    handleClick: () => ({}),
  },
};
