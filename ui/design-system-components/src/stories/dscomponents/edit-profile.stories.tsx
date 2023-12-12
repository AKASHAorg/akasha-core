import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import EditProfile, { EditProfileProps } from '../../components/EditProfile';

const meta: Meta<EditProfileProps> = {
  title: 'DSComponents/Profile/Edit/EditProfile',
  component: EditProfile,
};

export default meta;
type Story = StoryObj<EditProfileProps>;

const avatar = { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } };

const coverImage = {
  default: {
    src: 'https://static.licdn.com/sc/h/55k1z8997gh8dwtihm11aajyq',
    height: 360,
    width: 360,
  },
};

const profileId = 'did:key:003410490050000320006570034567114572000';

export const BaseEditProfile: Story = {
  render: () => (
    <EditProfile
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
        publicImagePath: '/images',
        dragToRepositionLabel: 'Drag to reposition',
        isSavingImage: false,
        onImageSave: () => ({}),
        onImageDelete: () => ({}),
        transformSource: () => ({
          src: 'https://placebeard.it/360x360',
          width: 360,
          height: 360,
        }),
      }}
      name={{ label: 'Name', initialValue: 'Mr. Snowman' }}
      userName={{ label: 'Username', initialValue: 'snowman' }}
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
        handleClick: formValues => {
          console.log(formValues);
        },
      }}
      linkLabel="External URLs"
      addNewLinkButtonLabel="Add new"
      description="You can add your personal websites or social links to be shared on your profile"
      socialLinks={[]}
    />
  ),
};
