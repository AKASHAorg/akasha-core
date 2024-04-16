import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Entry, { EntryProps } from '../../components/ProfileEngagements/Entry';

const meta: Meta<EntryProps> = {
  title: 'DSComponents/Profile/Entry',
  component: Entry,
  tags: ['autodocs'],
  argTypes: {
    profileAnchorLink: { control: 'text' },
    avatar: { control: 'object' },
    name: { control: 'text' },
    profileIds: { control: 'object' },
    followId: { control: 'text' },
    isFollowing: { control: 'boolean' },
    transformSource: { action: 'source transformed' },
  },
};

type Story = StoryObj<EntryProps>;

const profileId = 'did:key:003410490050000320006570034567114572000';

const avatar = { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } };

export const Default: Story = {
  args: {
    profileAnchorLink: '',
    avatar,
    name: 'Coffee Lover',
    profileIds: {
      id: 'id',
      did: profileId,
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
