import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import Following, {
  FollowingProps,
} from '../../components/ProfileEngagements/Engagement/Following';

const meta: Meta<FollowingProps> = {
  title: 'DSComponents/Profile/Following',
  component: Following,
};

export default meta;
type Story = StoryObj<FollowingProps>;

const commonProps = {
  authenticatedDID: 'did:key:55FaD4201494x0rt17C9892i9fae4d52fe3BD124',
  followList: new Map(),
  viewerIsOwner: false,
  ownerUserName: 'espressolover',
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

const followingData = {
  id: 'some id',
  createdAt: Date.now(),
  name: 'Latte Lover',
  did: { id: 'did:key:73FaD4201494x0rt17B9892i9fae4d52fe3BD377', isViewer: true },
  followersCount: 0,
};

const variants: FollowingProps[] = [
  {
    ...commonProps,
    emptyEntryTitleLabel: <>This user is not following anyone yet</>,
    emptyEntryBodyLabel: <></>,
    following: [
      {
        id: '1',
        profile: followingData,
        did: { id: 'did:pkh:eip155:5:0x405616bf38175c5a73edd5b506d0ce820074acae' },
        isFollowing: true,
      },
    ],
  },
  {
    ...commonProps,
    emptyEntryTitleLabel: <>This user is not following anyone yet</>,
    emptyEntryBodyLabel: <></>,
    following: [],
  },
  {
    ...commonProps,
    emptyEntryTitleLabel: <>You have no following yet</>,
    emptyEntryBodyLabel: (
      <>Interact with apps, to get people who are interested in your content to follow you</>
    ),
    following: [],
  },
];

export const FollowingVariants: Story = {
  render: () => (
    <Stack direction="column" spacing="gap-y-2" customStyle="w-[50%]">
      {variants.map((variant, idx) => (
        <Following key={idx} {...variant} />
      ))}
    </Stack>
  ),
};
