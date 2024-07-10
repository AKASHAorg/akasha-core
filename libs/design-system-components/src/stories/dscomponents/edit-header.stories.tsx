import type { Meta, StoryObj } from '@storybook/react';
import { Header, HeaderProps } from '../../components/EditProfile/General/Header';

const meta: Meta<HeaderProps> = {
  title: 'DSComponents/Profile/Edit/Header',
  component: Header,
  tags: ['autodocs'],
};

type Story = StoryObj<HeaderProps>;

const profileId = 'did:key:003410490050000320006570034567114572000';

const avatar = {
  default: {
    src: 'https://next.akasha-world-framework.pages.dev/images/avatar-1-min.webp',
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

export const Default: Story = {
  args: {
    coverImage,
    avatar,
    profileId,
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
    dragToRepositionLabel: 'Drag to reposition',
    isSavingImage: false,
    publicImagePath: '/images',
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
    onAvatarChange: () => ({}),
    onCoverImageChange: () => ({}),
    onImageSave: () => ({}),
    onImageDelete: () => ({}),
  },
};

export default meta;
