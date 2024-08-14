import type { Meta, StoryObj } from '@storybook/react';
import ProfileAvatarButton, {
  ProfileAvatarButtonProps,
} from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';

ProfileAvatarButton.displayName = 'ProfileAvatarButton';

const meta: Meta<ProfileAvatarButtonProps> = {
  title: 'DSCore/Buttons/ProfileAvatarButton',
  component: ProfileAvatarButton,
  tags: ['autodocs'],
  argTypes: {
    customStyle: { control: 'text' },
    avatar: { control: 'object' },
    alternativeAvatars: { control: 'object' },
    label: { control: 'text' },
    profileId: { control: 'text' },
    truncateText: { control: 'boolean' },
    href: { control: 'text' },
    onClick: { action: 'button clicked' },
  },
};

type Story = StoryObj<ProfileAvatarButtonProps>;

export const Default: Story = {
  args: {
    label: 'Profile Avatar Button',
    profileId: 'did:pkh:eip155:5:0x36c703c4d22af437dc883e2e0884e57404e16493',
    avatar: { src: 'https://placebeard.it/360x360', height: 360, width: 360 },
  },
};

export const NotTruncatedButton: Story = {
  args: {
    label: 'Profile Avatar Button',
    profileId: 'did:pkh:eip155:5:0x36c703c4d22af437dc883e2e0884e57404e16493',
    avatar: { src: 'https://placebeard.it/360x360', height: 360, width: 360 },
    truncateText: false,
  },
};

export default meta;
