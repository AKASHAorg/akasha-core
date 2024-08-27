import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import EntryCard, { EntryCardProps } from '../../components/Entry/EntryCard';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const meta: Meta<EntryCardProps> = {
  title: 'DSComponents/Cards/EntryCard',
  component: props => (
    <Stack customStyle="w-[50%]">
      <EntryCard {...props} />
    </Stack>
  ),
  tags: ['autodocs'],
};

type Story = StoryObj<EntryCardProps>;

export const Default: Story = {
  args: {
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
    itemType: EntityTypes.REFLECT,
    flagAsLabel: 'Flag',
    notEditableLabel: 'A reflection created over 10 minutes ago cannot be edited.',
    removed: {
      author: (
        <p>
          AKASHA world members won&apos;t be able to see the content of your reflection because you
          have violated the following Code of Conduct.
        </p>
      ),
      others: (
        <p>
          This reflection has been delisted for the violation of our Code of Conduct. All
          reflections are disabled.
        </p>
      ),
    },
    moderated: {
      author: <p>Content has been moderated.</p>,
      others: <p>Content has been moderated.</p>,
    },
    slateContent: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'hello world...',
          },
        ],
      },
    ],
    onEdit: () => ({}),
    onEntryFlag: () => ({}),
    onMentionClick: () => ({}),
    onReflect: () => ({}),
  },
};

export const DelistedEntryCardOthers: Story = {
  args: {
    isLoggedIn: true,
    entryData: {
      active: false,
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
    itemType: EntityTypes.REFLECT,
    flagAsLabel: 'Flag',
    notEditableLabel: 'A reflection created over 10 minutes ago cannot be edited.',
    removed: {
      author: (
        <p>
          AKASHA world members won&apos;t be able to see the content of your reflection because you
          have violated the following Code of Conduct.
        </p>
      ),
      others: (
        <p>
          This reflection has been delisted for the violation of our Code of Conduct. All
          reflections are disabled.
        </p>
      ),
    },
    moderated: {
      author: <p>Content has been moderated.</p>,
      others: <p>Content has been moderated.</p>,
    },
    slateContent: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'hello world...',
          },
        ],
      },
    ],
    onEdit: () => ({}),
    onEntryFlag: () => ({}),
    onMentionClick: () => ({}),
    onReflect: () => ({}),
  },
};

export const DelistedEntryCardAuthor: Story = {
  args: {
    isLoggedIn: true,
    entryData: {
      active: false,
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
    itemType: EntityTypes.REFLECT,
    flagAsLabel: 'Flag',
    notEditableLabel: 'A reflection created over 10 minutes ago cannot be edited.',
    removed: {
      author: (
        <p>
          AKASHA world members won&apos;t be able to see the content of your reflection because you
          have violated the following Code of Conduct.
        </p>
      ),
      others: (
        <p>
          This reflection has been delisted for the violation of our Code of Conduct. All
          reflections are disabled.
        </p>
      ),
    },
    moderated: {
      author: <p>Content has been moderated.</p>,
      others: <p>Content has been moderated.</p>,
    },
    slateContent: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'hello world...',
          },
        ],
      },
    ],
    onEdit: () => ({}),
    onEntryFlag: () => ({}),
    onMentionClick: () => ({}),
    onReflect: () => ({}),
    isViewer: true,
    editLabel: 'Edit',
    editable: false,
  },
};

export const NSFWCard: Story = {
  args: {
    isLoggedIn: true,
    entryData: {
      active: true,
      nsfw: true,
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
    itemType: EntityTypes.REFLECT,
    flagAsLabel: 'Flag',
    notEditableLabel: 'A reflection created over 10 minutes ago cannot be edited.',
    removed: {
      author: (
        <p>
          AKASHA world members won&apos;t be able to see the content of your reflection because you
          have violated the following Code of Conduct.
        </p>
      ),
      others: (
        <p>
          This reflection has been delisted for the violation of our Code of Conduct. All
          reflections are disabled.
        </p>
      ),
    },
    moderated: {
      author: <p>Content has been moderated.</p>,
      others: <p>Content has been moderated.</p>,
    },
    slateContent: [
      {
        type: 'link',
        url: 'https://images.unsplash.com/photo-1524419986249-348e8fa6ad4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2FtcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=900&q=60',
        children: [
          {
            text: '',
          },
        ],
      },
    ],
    onEdit: () => ({}),
    onEntryFlag: () => ({}),
    onMentionClick: () => ({}),
    onReflect: () => ({}),
    nsfw: {
      sensitiveContentLabel: 'Sensitive Content!',
      clickToViewLabel: 'Click to View',
    },
  },
};
export default meta;
