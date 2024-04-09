import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import Followers, {
  FollowersProps,
} from '../../components/ProfileEngagements/Engagement/Followers';

const meta: Meta<FollowersProps> = {
  title: 'DSComponents/Profile/Followers',
  component: Followers,
  tags: ['autodocs'],
  argTypes: {
    authenticatedDID: { control: 'text' },
    followList: { control: 'object' },
    profileAnchorLink: { control: 'text' },
    publicImgPath: { control: 'text' },
    onLoadMore: { action: 'more loaded' },
    transformSource: { action: 'source transformed' },
    onProfileClick: { action: 'profile transformed' },
    renderFollowElement: { action: 'follow element rendered' },
  },
};

type Story = StoryObj<FollowersProps>;

const baseArgs: Story = {
  args: {
    authenticatedDID: 'did:key:55FaD4201494x0rt17C9892i9fae4d52fe3BD124',
    followList: new Map(),
    profileAnchorLink: '#',
    publicImgPath: '',
    emptyEntryTitleLabel: <>This user has no followers yet!</>,
    emptyEntryBodyLabel: <></>,
    onLoadMore: () => Promise.resolve({}),
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
    renderFollowElement: () => (
      <DuplexButton variant="secondary" active={false} inactiveLabel="Follow" />
    ),
    onProfileClick: () => ({}),
  },
};

const followerData = {
  id: 'some id',
  createdAt: Date.now(),
  name: 'Coffee Lover',
  did: { id: 'did:key:73FaD4201494x0rt17B9892i9fae4d52fe3BD377', isViewer: false },
  followersCount: 0,
};

export const Default: Story = {
  args: {
    ...baseArgs.args,
    followers: [{ id: '0', isFollowing: false, did: { akashaProfile: followerData } }],
  },
};

export const NoFollowers: Story = {
  args: {
    ...baseArgs.args,
    followers: [],
  },
};

export const IsViewer: Story = {
  args: {
    ...baseArgs.args,
    emptyEntryTitleLabel: <>You have no followers yet</>,
    emptyEntryBodyLabel: (
      <>Interact with apps, to get people who are interested in your content to follow you</>
    ),
    followers: [],
  },
};

export default meta;
