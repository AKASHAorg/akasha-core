import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import Followers, {
  FollowersProps,
} from '../../components/ProfileEngagements/Engagement/Followers';

const meta: Meta<FollowersProps> = {
  title: 'DSComponents/Profile/Followers',
  component: Followers,
};

type Story = StoryObj<FollowersProps>;

export const Default: Story = {
  args: {
    authenticatedDID: 'did:key:55FaD4201494x0rt17C9892i9fae4d52fe3BD124',
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
    followers: [
      {
        id: '0',
        isFollowing: false,
        did: {
          akashaProfile: {
            id: 'some id',
            createdAt: Date.now(),
            name: 'Coffee Lover',
            did: { id: 'did:key:73FaD4201494x0rt17B9892i9fae4d52fe3BD377', isViewer: false },
            followersCount: 0,
          },
        },
      },
    ],
  },
};

export const NoFollowers: Story = {
  args: {
    authenticatedDID: 'did:key:55FaD4201494x0rt17C9892i9fae4d52fe3BD124',
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
    followers: [],
  },
};

export const IsViewer: Story = {
  args: {
    authenticatedDID: 'did:key:55FaD4201494x0rt17C9892i9fae4d52fe3BD124',
    profileAnchorLink: '#',
    publicImgPath: '',
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
    emptyEntryTitleLabel: <>You have no followers yet</>,
    emptyEntryBodyLabel: (
      <>Interact with apps, to get people who are interested in your content to follow you</>
    ),
    followers: [],
  },
};

export default meta;
