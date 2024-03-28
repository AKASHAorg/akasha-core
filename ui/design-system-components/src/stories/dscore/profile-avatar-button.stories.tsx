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
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] },
    profileId: { control: 'text' },
    truncateText: { control: 'boolean' },
    href: { control: 'text' },
    onClick: { action: 'button clicked' },
    onClickAvatar: { action: 'avatar clicked' },
    onMouseEnter: { action: 'mouse entered' },
    onMouseLeave: { action: 'mouse left' },
  },
};

type Story = StoryObj<ProfileAvatarButtonProps>;

const profileId = 'did:pkh:eip155:5:0x36c703c4d22af437dc883e2e0884e57404e16493';

const avatar = { src: 'https://placebeard.it/360x360', height: 360, width: 360 };

const baseArgs: Story = {
  args: {
    label: 'Profile Avatar Button',
    profileId,
    avatar,
  },
};

export const Default: Story = { args: { ...baseArgs.args } };

export const NotTruncatedButton: Story = { args: { ...baseArgs.args, truncateText: false } };

export const ButtonWithSize: Story = { args: { ...baseArgs.args, size: 'lg' } };

export default meta;
