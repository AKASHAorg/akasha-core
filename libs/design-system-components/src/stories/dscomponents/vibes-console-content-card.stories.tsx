import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import VibesConsoleContentCard, {
  VibesConsoleContentCardProps,
} from '../../components/VibesConsoleContentCard';
import { ItemType } from '../../components/VibesConsoleContentCard/mini-profile-cta';

const meta: Meta<VibesConsoleContentCardProps> = {
  title: 'DSComponents/Vibes/VibesConsoleContentCard',
  component: VibesConsoleContentCard,
  tags: ['autodocs'],
};

type Story = StoryObj<VibesConsoleContentCardProps>;

const handleButtonClick = () => {
  /** */
};

export const AntennaBeam: Story = {
  args: {
    entry: {
      id: 'B-19089',
      itemData: {
        isLoggedIn: true,
        entryData: {
          active: true,
          authorId: 'did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8',
          createdAt: new Date('Jan 01 2024').toISOString(),
          id: 'kjzl6kcym7w8y90evf7vartzsbj9jbzdq',
        },
        profileAvatar: (
          <ProfileAvatarButton
            label="Profile Avatar Button"
            profileId="did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8"
            avatar={{ src: 'https://placebeard.it/360x360', height: 360, width: 360 }}
          />
        ),
        itemType: EntityTypes?.REFLECT,
        flagAsLabel: 'Flag',
        notEditableLabel: 'A reflection created over 10 minutes ago cannot be edited.',
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
        onEdit: () => ({}),
        onEntryFlag: () => ({}),
        onMentionClick: () => ({}),
        onReflect: () => ({}),
      },
      appName: 'Antenna',
      itemType: 'Beam' as ItemType,
      primaryReason: 'Sexual or human exploitation',
      reportCount: 46,
      lastReportDate: new Date('Feb 01 2024'),
    },
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

export const AntennaReflection: Story = {
  args: {
    entry: {
      id: 'R-19090',
      itemData: {
        isLoggedIn: true,
        entryData: {
          active: true,
          authorId: 'did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8',
          createdAt: new Date('Jan 01 2024').toISOString(),
          id: 'kjzl6kcym7w8y90evf7vartzsbj9jbzdq',
        },
        profileAvatar: (
          <ProfileAvatarButton
            label="Profile Avatar Button"
            profileId="did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8"
            avatar={{ src: 'https://placebeard.it/360x360', height: 360, width: 360 }}
          />
        ),
        itemType: EntityTypes?.REFLECT,
        flagAsLabel: 'Flag',
        notEditableLabel: 'A reflection created over 10 minutes ago cannot be edited.',
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
        onEdit: () => ({}),
        onEntryFlag: () => ({}),
        onMentionClick: () => ({}),
        onReflect: () => ({}),
      },
      appName: 'Antenna',
      itemType: 'Reflection',
      primaryReason: 'Sexual or human exploitation',
      reportCount: 46,
      lastReportDate: new Date('Feb 01 2024'),
    },
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

export const Profile: Story = {
  args: {
    entry: {
      id: 'P-17078',
      itemData: {
        avatar: {
          height: 320,
          src: 'https://placebeard.it/360x360',
          width: 320,
        },
        alternativeAvatars: [],
        name: 'Golden Showers',
        did: { id: 'somerandomdid' },
        nsfw: false,
      },
      appName: 'Profile',
      itemType: 'Profile',
      primaryReason: 'Sexual or human exploitation',
      reportCount: 46,
      lastReportDate: new Date('Feb 01 2024'),
    },
    caseLabel: 'Case',
    nsfwLabel: 'Profile tagged NSFW',
    viewProfileLabel: 'View Profile',
    reportedForLabels: { first: 'A', second: 'has been reported for' },
    lastReportLabel: 'Last Report',
    primaryButtonLabel: 'Keep',
    secondaryButtonLabel: 'Suspend',
    onButtonClick: () => handleButtonClick,
    onReasonClick: () => ({}),
  },
};

export const NSFWProfile: Story = {
  args: {
    entry: {
      id: 'P-17079',
      itemData: {
        avatar: {
          height: 320,
          src: 'https://placebeard.it/360x360',
          width: 320,
        },
        alternativeAvatars: [],
        name: 'Golden Showers',
        did: { id: 'somerandomdid' },
        nsfw: true,
      },
      appName: 'Profile',
      itemType: 'Profile',
      primaryReason: 'Sexual or human exploitation',
      reportCount: 46,
      lastReportDate: new Date('Feb 01 2024'),
    },
    caseLabel: 'Case',
    nsfwLabel: 'Profile tagged NSFW',
    viewProfileLabel: 'View Profile',
    reportedForLabels: { first: 'A', second: 'has been reported for' },
    lastReportLabel: 'Last Report',
    primaryButtonLabel: 'Keep',
    secondaryButtonLabel: 'Suspend',
    onButtonClick: () => handleButtonClick,
    onReasonClick: () => ({}),
  },
};

export default meta;
