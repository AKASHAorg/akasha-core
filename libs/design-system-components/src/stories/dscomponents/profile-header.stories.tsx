import type { Meta, StoryObj } from '@storybook/react';
import Header, { HeaderProps } from '../../components/Profile/Header';

const meta: Meta<HeaderProps> = {
  title: 'DSComponents/Profile/ProfileHeader',
  component: Header,
  tags: ['autodocs'],
  argTypes: {
    profileId: { control: 'text' },
    profileName: { control: 'text' },
    publicImagePath: { control: 'text' },
    viewerIsOwner: { control: 'boolean' },
    transformSource: { action: 'source transformed' },
  },
};

type Story = StoryObj<HeaderProps>;

const profileId = 'did:key:003410490050000320006570034567114572000';

const baseArgs: Story = {
  args: {
    profileId,
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

export const Default: Story = {
  args: {
    ...baseArgs.args,
  },
};

export const IsViewer: Story = {
  args: {
    ...baseArgs.args,
    viewerIsOwner: true,
  },
};

export default meta;
