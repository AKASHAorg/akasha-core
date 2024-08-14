import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Entry, { EntryProps } from '../../components/ProfileEngagements/Entry';

const meta: Meta<EntryProps> = {
  title: 'DSComponents/Profile/Entry',
  component: Entry,
  tags: ['autodocs'],
};

type Story = StoryObj<EntryProps>;

export const Default: Story = {
  args: {
    profileAnchorLink: '',
    avatar: { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } },
    name: 'Coffee Lover',
    profileIds: {
      id: 'id',
      did: 'did:key:003410490050000320006570034567114572000',
    },
    followId: 'id',
    isFollowing: false,
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
    renderFollowElement: () => <></>,
    onProfileClick: () => ({}),
  },
};

export default meta;
