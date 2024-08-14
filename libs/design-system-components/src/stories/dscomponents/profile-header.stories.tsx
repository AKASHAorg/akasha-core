import type { Meta, StoryObj } from '@storybook/react';
import Header, { HeaderProps } from '../../components/Profile/Header';

const meta: Meta<HeaderProps> = {
  title: 'DSComponents/Profile/ProfileHeader',
  component: Header,
  tags: ['autodocs'],
};

type Story = StoryObj<HeaderProps>;

export const Default: Story = {
  args: {
    profileId: 'did:key:003410490050000320006570034567114572000',
    profileName: 'Coffee Lover',
    onClickCoverImage: () => ({}),
    onClickAvatar: () => ({}),
    onClickProfileName: () => ({}),
    onCloseOverlay: () => ({}),
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
  },
};

export const IsViewer: Story = {
  args: {
    profileId: 'did:key:003410490050000320006570034567114572000',
    profileName: 'Coffee Lover',
    onClickCoverImage: () => ({}),
    onClickAvatar: () => ({}),
    onClickProfileName: () => ({}),
    onCloseOverlay: () => ({}),
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
    viewerIsOwner: true,
  },
};

export default meta;
