import React from 'react';
import { Header, HeaderProps } from './index';

export default {
  title: 'Profile/EditHeader',
  component: Header,
};

const ethAddress = '0x003410490050000320006570034567114572000';

const Template = (args: HeaderProps) => <Header {...args} />;

export const BaseCoverImage = Template.bind({});
BaseCoverImage.args = {
  ethAddress,
  coverImage: { url: 'https://static.licdn.com/sc/h/55k1z8997gh8dwtihm11aajyq' },
  avatar: { url: 'https://next.akasha-world-framework.pages.dev/images/avatar-placeholder-1.webp' },
  title: 'Avatar & Cover Image',
  cancelLabel: 'Cancel',
  deleteLabel: 'Delete',
  saveLabel: 'Save',
  imageTitle: { avatar: { label: 'Edit Avatar' }, coverImage: { label: 'Edit Cover' } },
  deleteTitle: { avatar: { label: 'Delete Avatar' }, coverImage: { label: 'Delete Cover' } },
  confirmationLabel: {
    avatar: 'Are you sure you want to delete your avatar? ',
    coverImage: 'Are you sure you want to delete your cover?',
  },
  onAvatarChange: () => ({}),
  onCoverImageChange: () => ({}),
};
