import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Followers, {
  FollowersProps,
} from '../../components/ProfileEngagements/Engagement/Followers';

const meta: Meta<FollowersProps> = {
  title: 'DSComponents/Profile/Followers',
  component: Followers,
};

export default meta;
type Story = StoryObj<FollowersProps>;

const commonProps = {
  authenticatedDID: 'did:key:55FaD4201494x0rt17C9892i9fae4d52fe3BD124',
  followList: new Map(),
  profileAnchorLink: '#',
  loadMore: false,
  publicImgPath: '',
  onLoadMore: () => Promise.resolve({}),
  transformSource: () => ({
    src: 'https://placebeard.it/360x360',
    width: 360,
    height: 360,
  }),
  renderFollowElement: () => <></>,
  onProfileClick: () => ({}),
};

const followerData = {
  id: 'some id',
  createdAt: Date.now(),
  name: 'Coffee Lover',
  did: { id: 'did:key:73FaD4201494x0rt17B9892i9fae4d52fe3BD377', isViewer: false },
  followersCount: 0,
};

const variants: FollowersProps[] = [
  {
    ...commonProps,
    emptyEntryTitleLabel: <>This user has no followers yet!</>,
    emptyEntryBodyLabel: <></>,
    followers: [{ id: '1', isFollowing: false, did: { akashaProfile: followerData } }],
  },
  {
    ...commonProps,
    emptyEntryTitleLabel: <>This user has no followers yet!</>,
    emptyEntryBodyLabel: <></>,
    followers: [],
  },
  {
    ...commonProps,
    emptyEntryTitleLabel: <>This user has no followers yet!</>,
    emptyEntryBodyLabel: <></>,
    followers: [{ id: '1', isFollowing: false, did: { akashaProfile: followerData } }],
  },
];

export const FollowersVariants: Story = {
  render: () => (
    <Stack direction="column" spacing="gap-y-2" customStyle="w-[50%]">
      {variants.map((variant, idx) => (
        <Followers key={idx} {...variant} />
      ))}
    </Stack>
  ),
};
