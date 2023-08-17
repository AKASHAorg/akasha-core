import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Entry, { EntryProps } from '.';

const meta: Meta<EntryProps> = {
  title: 'Profile/Entry',
  component: Entry,
};

export default meta;
type Story = StoryObj<EntryProps>;

const profileId = 'did:key:003410490050000320006570034567114572000';

const avatar = { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } };

export const BaseEntry: Story = {
  render: () => (
    <Entry
      profileAnchorLink=""
      profileId={profileId}
      avatar={avatar}
      name="Coffee Lover"
      profileStreamId="id"
      followStreamId="id"
      isFollowing={false}
      getMediaUrl={() => ({
        default: { src: 'https://placebeard.it/360x360', width: 360, height: 360 },
      })}
      renderFollowElement={() => <></>}
      onProfileClick={() => ({})}
    />
  ),
};
