import React from 'react';
import { GeneralForm, GeneralFormProps } from '.';

export default {
  title: 'Profile/GeneralForm',
  component: GeneralForm,
};

const ethAddress = '0x003410490050000320006570034567114572000';

const Template = (args: GeneralFormProps) => <GeneralForm {...args} />;

export const BaseGeneralForm = Template.bind({});
BaseGeneralForm.args = {
  header: {
    title: 'Avatar & Cover Image',
    coverImage: { url: 'https://static.licdn.com/sc/h/55k1z8997gh8dwtihm11aajyq' },
    avatar: { url: 'https://placebeard.it/360x360' },
    ethAddress,
    cancelLabel: 'Cancel',
    deleteLabel: 'Delete',
    saveLabel: 'Save',
    imageTitle: {
      avatar: { label: 'Edit Avatar' },
      coverImage: { label: 'Edit Cover' },
    },
    deleteTitle: {
      avatar: { label: 'Delete Avatar' },
      coverImage: { label: 'Delete Cover' },
    },
    deleteConfirmation: {
      avatar: 'Are you sure you want to delete your avatar?',
      coverImage: 'Are you sure you want to delete your cover?',
    },
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
  bio: {
    label: 'Bio',
    initialValue: 'snowman.eth',
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
