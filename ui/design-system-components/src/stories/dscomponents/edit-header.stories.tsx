import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Header, HeaderProps } from '../../components/EditProfile/GeneralForm/Header';

const meta: Meta<HeaderProps> = {
  title: 'DSComponents/Profile/Edit/Header',
  component: Header,
};

export default meta;
type Story = StoryObj<HeaderProps>;

const profileId = 'did:key:003410490050000320006570034567114572000';

const avatar = {
  default: {
    src: 'https://next.akasha-world-framework.pages.dev/images/avatar-placeholder-1.webp',
    height: 360,
    width: 360,
  },
};

const coverImage = {
  default: {
    src: 'https://static.licdn.com/sc/h/55k1z8997gh8dwtihm11aajyq',
    height: 360,
    width: 360,
  },
};

export const BaseHeader: Story = {
  render: () => (
    <Header
      avatar={avatar}
      coverImage={coverImage}
      profileId={profileId}
      title="Avatar & Cover Image"
      cancelLabel="Cancel"
      deleteLabel="Delete"
      saveLabel="Save"
      dragToRepositionLabel="Drag to reposition"
      isSavingImage={false}
      imageTitle={{ avatar: { label: 'Edit Avatar' }, coverImage: { label: 'Edit Cover' } }}
      deleteTitle={{ avatar: { label: 'Delete Avatar' }, coverImage: { label: 'Delete Cover' } }}
      confirmationLabel={{
        avatar: 'Are you sure you want to delete your avatar? ',
        coverImage: 'Are you sure you want to delete your cover?',
      }}
      onAvatarChange={() => ({})}
      onCoverImageChange={() => ({})}
      onImageDelete={() => ({})}
      onImageSave={() => ({})}
    />
  ),
};
