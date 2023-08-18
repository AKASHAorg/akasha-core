import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Profile } from '@akashaorg/typings/ui';

import Following, { FollowingProps } from './Following';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const meta: Meta<FollowingProps> = {
  title: 'DSComponents/Profile/Following',
  component: Following,
};

export default meta;
type Story = StoryObj<FollowingProps>;

const commonProps = {
  viewerIsOwner: false,
  ownerUserName: 'espressolover',
  profileAnchorLink: '#',
  loadMore: false,
  onLoadMore: () => ({}),
  getMediaUrl: () => ({
    default: { src: 'https://placebeard.it/360x360', width: 360, height: 360 },
  }),
  renderFollowElement: () => <></>,
  onProfileClick: () => ({}),
};

const followingData: Profile = {
  id: 'some id',
  createdAt: Date.now(),
  name: 'Latte Lover',
  did: { id: 'did:key:73FaD4201494x0rt17B9892i9fae4d52fe3BD377' },
};

const variants: FollowingProps[] = [
  {
    ...commonProps,
    following: [{ id: '1', profile: followingData, isFollowing: true }],
  },
  {
    ...commonProps,
    following: [],
  },

  {
    ...commonProps,
    following: [],
    viewerIsOwner: false,
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
