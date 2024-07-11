import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import Following, {
  FollowingProps,
} from '../../components/ProfileEngagements/Engagement/Following';

const meta: Meta<FollowingProps> = {
  title: 'DSComponents/Profile/Following',
  component: Following,
  tags: ['autodocs'],
};

type Story = StoryObj<FollowingProps>;

const baseArgs: Story = {
  args: {
    authenticatedDID: 'did:key:55FaD4201494x0rt17C9892i9fae4d52fe3BD124',
    followList: new Map(),
    profileAnchorLink: '#',
    publicImgPath: '',
    emptyEntryTitleLabel: <>This user is not following anyone yet</>,
    emptyEntryBodyLabel: <></>,
    onLoadMore: () => Promise.resolve({}),
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
    renderFollowElement: () => (
      <DuplexButton
        variant="secondary"
        active={true}
        activeLabel="Following"
        activeHoverLabel="Unfollow"
      />
    ),
    onProfileClick: () => ({}),
  },
};

const followingData = {
  id: 'some id',
  createdAt: Date.now(),
  name: 'Latte Lover',
  did: { id: 'did:key:73FaD4201494x0rt17B9892i9fae4d52fe3BD377', isViewer: true },
  followersCount: 0,
};

export const Default: Story = {
  args: {
    ...baseArgs.args,
    following: [
      {
        id: '0',
        profile: followingData,
        did: { id: 'did:pkh:eip155:5:0x405616bf38175c5a73edd5b506d0ce820074acae' },
        isFollowing: true,
      },
    ],
  },
};

export const NoFollowing: Story = {
  args: {
    ...baseArgs.args,
    following: [],
  },
};

export const IsViewer: Story = {
  args: {
    ...baseArgs.args,
    emptyEntryTitleLabel: <>You are not following anyone yet</>,
    emptyEntryBodyLabel: <>Discover contents from feed and widgets and find people to follow</>,
    following: [],
  },
};

export default meta;
