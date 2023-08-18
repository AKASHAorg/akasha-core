import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { GeneralForm, GeneralFormProps } from '.';

const meta: Meta<GeneralFormProps> = {
  title: 'DSComponents/Profile/Edit/GeneralForm',
  component: GeneralForm,
};

export default meta;
type Story = StoryObj<GeneralFormProps>;

const avatar = { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } };

const coverImage = {
  default: {
    src: 'https://static.licdn.com/sc/h/55k1z8997gh8dwtihm11aajyq',
    height: 360,
    width: 360,
  },
};

const profileId = 'did:key:003410490050000320006570034567114572000';

export const BaseGeneralForm: Story = {
  render: () => (
    <GeneralForm
      header={{
        title: 'Avatar & Cover Image',
        coverImage: coverImage,
        avatar: avatar,
        profileId,
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
        confirmationLabel: {
          avatar: 'Are you sure you want to delete your avatar?',
          coverImage: 'Are you sure you want to delete your cover?',
        },
        dragToRepositionLabel: 'Drag to reposition',
        isSavingImage: false,
        onImageSave: () => ({}),
        onImageDelete: () => ({}),
      }}
      name={{ label: 'Name', initialValue: 'Mr. Snowman' }}
      userName={{ label: 'Username', initialValue: 'snowman' }}
      ens={{
        label: 'ENS Name',
        initialValue: 'snowman.eth',
      }}
      ensButton={{
        label: 'Fill info from ENS data',
        handleClick: () => ({}),
      }}
      bio={{
        label: 'Bio',
        initialValue: 'Bio',
      }}
      cancelButton={{
        label: 'Cancel',
        handleClick: () => ({}),
      }}
      saveButton={{
        label: 'Save',
        handleClick: () => ({}),
      }}
    />
  ),
};
