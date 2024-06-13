import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AuthorProfileAvatar from '@akashaorg/ui-lib-feed/lib/components/cards/author-profile-avatar';
import VibesConsoleContentCard, {
  VibesConsoleContentCardProps,
} from '../../components/VibesConsoleContentCard';
import {
  ItemType,
  ProfileItemData,
} from '../../components/VibesConsoleContentCard/mini-profile-cta';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import { EntryCardProps } from '../../components/Entry/EntryCard';

const meta: Meta<VibesConsoleContentCardProps> = {
  title: 'DSComponents/Vibes/VibesConsoleContentCard',
  component: VibesConsoleContentCard,
  tags: ['autodocs'],
};

type Story = StoryObj<VibesConsoleContentCardProps>;

const sampleEntryData: EntryCardProps = {
  isLoggedIn: true,
  entryData: {
    active: true,
    authorId: 'did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8',
    createdAt: '12/12/2023',
    id: 'kshggg55555',
  },
  profileAvatar: (
    <AuthorProfileAvatar authorId="authorId" createdAt={new Date('Jan 01 2024').toISOString()} />
  ),
  itemType: EntityTypes?.REFLECT,
  flagAsLabel: 'Flag',
  slateContent: [
    {
      type: 'paragraph',
      children: [
        {
          text: 'This content will be reported, for test purposes',
        },
      ],
    },
  ],
  onContentClick: () => ({}),
  onMentionClick: () => ({}),
  onTagClick: () => ({}),
};

const sampleProfileData: ProfileItemData = {
  avatar: {
    height: 320,
    src: 'https://placebeard.it/360x360',
    width: 320,
  },
  alternativeAvatars: [],
  name: 'Golden Showers',
  did: { id: 'somerandomdid' },
  nsfw: false,
};

const sampleEntry = {
  id: 'B-19089',
  itemData: sampleEntryData,
  appName: 'Antenna',
  itemType: 'Beam' as ItemType,
  primaryReason: 'Sexual or human exploitation',
  reportCount: 46,
  lastReportDate: new Date('Feb 01 2024'),
};

const handleButtonClick = () => {
  /** */
};

const baseArgs: Story = {
  args: {
    entry: sampleEntry,
    caseLabel: 'Case',
    nsfwLabel: 'Profile tagged NSFW',
    viewProfileLabel: 'View Profile',
    reportedForLabels: { first: 'A', second: 'has been reported for' },
    lastReportLabel: 'Last Report',
    primaryButtonLabel: 'Keep',
    secondaryButtonLabel: 'Delist',
    onButtonClick: () => handleButtonClick,
    onReasonClick: () => ({}),
  },
};

export const AntennaBeam: Story = {
  args: {
    ...baseArgs.args,
  },
};

export const AntennaReflection: Story = {
  args: {
    ...baseArgs.args,
    entry: { ...sampleEntry, itemType: 'Reflection', id: 'R-19090' },
  },
};

export const Profile: Story = {
  args: {
    ...baseArgs.args,
    entry: {
      ...sampleEntry,
      itemData: sampleProfileData,
      appName: 'Profile',
      itemType: 'Profile',
      id: 'P-17078',
    },
    secondaryButtonLabel: 'Suspend',
  },
};

export const NSFWProfile: Story = {
  args: {
    ...baseArgs.args,
    entry: {
      ...sampleEntry,
      itemData: { ...sampleProfileData, nsfw: true },
      appName: 'Profile',
      itemType: 'Profile',
      id: 'P-17079',
    },
    secondaryButtonLabel: 'Suspend',
  },
};

export default meta;
