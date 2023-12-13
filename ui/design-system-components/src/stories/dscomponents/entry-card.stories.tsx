import React from 'react';
import EntryCard, { EntryCardProps } from '../../components/Entry/EntryCard';
import EntryLoadingPlaceholder from '../../components/Entry/EntryCardLoading';
import type { Meta, StoryObj } from '@storybook/react';
import { EntityTypes } from '@akashaorg/typings/lib/ui';

const meta: Meta<
  Omit<EntryCardProps, 'itemType'> & {
    itemType: EntityTypes.REFLECT | EntityTypes.BEAM;
  }
> = {
  title: 'DSComponents/Card/EntryCard',
  component: EntryCard,
};

export default meta;
type Story = StoryObj<EntryCardProps>;

const ENTRY_DATA = {
  active: true,
  authorId: 'did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8',
  content: null,
  createdAt: '12/12/2023',
  id: 'kshggg55555',
  beamID: 1,
};

export const BaseEntryCard: Story = {
  render: () => (
    <EntryCard
      entryData={ENTRY_DATA}
      authorProfile={{
        data: {
          did: { id: 'did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8' },
          name: 'Coffee Lover',
        },
        status: 'success',
      }}
      itemType={EntityTypes.REFLECT}
      slateContent={[
        {
          type: 'paragraph',
          children: [
            {
              text: 'Content goes here ...',
            },
          ],
        },
      ]}
      onContentClick={() => ({})}
      onMentionClick={() => ({})}
      onTagClick={() => ({})}
      transformSource={() => ({
        src: 'https://placebeard.it/360x360',
        width: 360,
        height: 360,
      })}
    />
  ),
};

export const DelistedEntryCardOthers: Story = {
  render: () => (
    <EntryCard
      entryData={{ ...ENTRY_DATA, active: false }}
      authorProfile={{
        data: {
          did: { id: 'did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8' },
          name: 'Coffee Lover',
        },
        status: 'success',
      }}
      removed={{
        author: {
          firstPart: 'AKASHA world members won’t be able to see the content ',
          secondPart: 'of your reflection because you have violated the following ',
          thirdPart: { url: '', content: 'Code of Conduct.' },
          tapToViewLabel: 'Tap to view',
        },
        others: {
          firstLine: 'This reflection has been delisted for the violation of our Code of Conduct.',
          secondLine: 'All reflections are disabled.',
        },
      }}
      itemType={EntityTypes.REFLECT}
      slateContent={[]}
      onContentClick={() => ({})}
      onMentionClick={() => ({})}
      onTagClick={() => ({})}
      transformSource={() => ({
        src: 'https://placebeard.it/360x360',
        width: 360,
        height: 360,
      })}
    />
  ),
};

export const DelistedEntryCardAuthor: Story = {
  render: () => (
    <EntryCard
      entryData={{ ...ENTRY_DATA, active: false }}
      authorProfile={{
        data: {
          did: { id: 'did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8' },
          name: 'Coffee Lover',
        },
        status: 'success',
      }}
      removed={{
        author: {
          firstPart: 'AKASHA world members won’t be able to see the content ',
          secondPart: 'of your reflection because you have violated the following ',
          thirdPart: { url: '', content: 'Code of Conduct.' },
          tapToViewLabel: 'Tap to view',
        },
        others: {
          firstLine: 'This reflection has been delisted for the violation of our Code of Conduct.',
          secondLine: 'All reflections are disabled.',
        },
      }}
      itemType={EntityTypes.REFLECT}
      slateContent={[]}
      onContentClick={() => ({})}
      onMentionClick={() => ({})}
      onTagClick={() => ({})}
      transformSource={() => ({
        src: 'https://placebeard.it/360x360',
        width: 360,
        height: 360,
      })}
    />
  ),
};

export const NSFWCard: Story = {
  render: () => (
    <EntryCard
      entryData={{ ...ENTRY_DATA, active: true, nsfw: true }}
      authorProfile={{
        data: {
          did: { id: 'did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8' },
          name: 'Coffee Lover',
        },
        status: 'success',
      }}
      removed={{
        author: {
          firstPart: 'AKASHA world members won’t be able to see the content ',
          secondPart: 'of your reflection because you have violated the following ',
          thirdPart: { url: '', content: 'Code of Conduct.' },
          tapToViewLabel: 'Tap to view',
        },
        others: {
          firstLine: 'This reflection has been delisted for the violation of our Code of Conduct.',
          secondLine: 'All reflections are disabled.',
        },
      }}
      nsfw={{
        sensitiveContentLabel: 'Sensitive Content!',
        clickToViewLabel: 'Click to View',
      }}
      itemType={EntityTypes.REFLECT}
      slateContent={[
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1524419986249-348e8fa6ad4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2FtcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=900&q=60',
          size: { width: '100px', height: '100px', naturalWidth: '100px', naturalHeight: '100px' },
          children: [
            {
              text: '',
            },
          ],
        },
      ]}
      onContentClick={() => ({})}
      onMentionClick={() => ({})}
      onTagClick={() => ({})}
      transformSource={() => ({
        src: 'https://placebeard.it/360x360',
        width: 360,
        height: 360,
      })}
    />
  ),
};

export const BaseEntryCardLoadingPlaceholder: Story = {
  render: () => <EntryLoadingPlaceholder />,
};
