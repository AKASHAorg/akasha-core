import React from 'react';
import EntryCard, { EntryCardProps } from '../../components/Entry/EntryCard';
import type { Meta, StoryObj } from '@storybook/react';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const Wrapped: React.FC<EntryCardProps> = props => (
  <Stack customStyle="w-[50%]">
    <EntryCard {...props} />
  </Stack>
);

const meta: Meta<EntryCardProps> = {
  title: 'DSComponents/Cards/EntryCard',
  component: Wrapped,
  tags: ['autodocs'],
  argTypes: {
    isLoggedIn: { control: 'boolean' },
    entryData: { control: 'object' },
    authorProfile: { control: 'object' },
    itemType: {
      control: 'select',
      options: [
        EntityTypes.ARTICLE,
        EntityTypes.BEAM,
        EntityTypes.PROFILE,
        EntityTypes.REFLECT,
        EntityTypes.TAG,
      ],
    },
    slateContent: { control: 'object' },
    onContentClick: { action: 'content clicked' },
    onMentionClick: { action: 'mention clicked' },
    onTagClick: { action: 'tag clicked' },
    transformSource: { action: 'source transformed' },
  },
};

type Story = StoryObj<EntryCardProps>;

const isLoggedIn = true;

const error = new Error('an error occured');

const entryData = {
  active: true,
  authorId: 'did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8',
  content: null,
  createdAt: '12/12/2023',
  id: 'kshggg55555',
  beamID: 1,
};

const authorProfile = {
  data: {
    did: { id: 'did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8' },
    name: 'Coffee Lover',
  },
  loading: false,
  error,
};

const baseArgs: Story = {
  args: {
    isLoggedIn,
    entryData,
    authorProfile,
    itemType: EntityTypes?.REFLECT,
    flagAsLabel: 'Flag',
    slateContent: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Content goes here ...',
          },
        ],
      },
    ],
    onContentClick: () => ({}),
    onMentionClick: () => ({}),
    onTagClick: () => ({}),
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
  },
};

export const Default: Story = {
  args: { ...baseArgs.args },
};

export const DelistedEntryCardOthers: Story = {
  args: {
    ...baseArgs.args,
    entryData: { ...entryData, active: false },
    removed: {
      author: {
        firstPart: "AKASHA world members won't be able to see the content",
        secondPart: 'of your reflection because you have violated the following ',
        thirdPart: { url: '', content: 'Code of Conduct.' },
        tapToViewLabel: 'Tap to view',
      },
      others: {
        firstLine: 'This reflection has been delisted for the violation of our Code of Conduct.',
        secondLine: 'All reflections are disabled.',
      },
    },
  },
};

export const DelistedEntryCardAuthor: Story = {
  args: {
    ...baseArgs.args,
    isViewer: true,
    entryData: { ...entryData, active: false },
    removed: {
      author: {
        firstPart: "AKASHA world members won't be able to see the content",
        secondPart: 'of your reflection because you have violated the following ',
        thirdPart: { url: '', content: 'Code of Conduct.' },
        tapToViewLabel: 'Tap to view',
      },
      others: {
        firstLine: 'This reflection has been delisted for the violation of our Code of Conduct.',
        secondLine: 'All reflections are disabled.',
      },
    },
    editLabel: 'Edit',
    editable: false,
  },
};

export const NSFWCard: Story = {
  args: {
    ...baseArgs.args,
    entryData: { ...entryData, active: true, nsfw: true },
    nsfw: {
      sensitiveContentLabel: 'Sensitive Content!',
      clickToViewLabel: 'Click to View',
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
  },
};
export default meta;
