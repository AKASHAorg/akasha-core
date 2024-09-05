import type { Meta, StoryObj } from '@storybook/react';
import { profileData } from '@akashaorg/design-system-core/lib/utils';
import ProfileSearchCard, { ProfileSearchCardProps } from '../../components/ProfileSearchCard';

const meta: Meta<ProfileSearchCardProps> = {
  title: 'DSComponents/Cards/ProfileSearchCard',
  component: ProfileSearchCard,
};

type Story = StoryObj<ProfileSearchCardProps>;

export const Default: Story = {
  args: {
    followLabel: 'follow',
    followingLabel: 'following',
    unfollowLabel: 'unfollow',
    isFollowing: false,
    profileData,
    handleFollow: () => ({}),
    handleUnfollow: () => ({}),
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
  },
};

export default meta;
