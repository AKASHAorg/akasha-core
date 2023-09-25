import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import EntryCard, { EntryCardProps } from '../../components/Entry/EntryCard';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import EntryLoadingPlaceholder from '../../components/Entry/EntryCardLoading';

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

export const BaseEntryCard: Story = {
  render: () => (
    <EntryCard
      entryData={{
        active: true,
        author: {
          id: 'did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8',
          isViewer: false,
        },
        content: null,
        createdAt: new Date(),
        id: 'kshggg55555',
        beamID: 1,
        version: 1,
      }}
      authorProfile={{
        data: {
          did: { id: 'did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8' },
          name: 'Coffee Lover',
        },
        status: 'success',
      }}
      itemType={EntityTypes.REFLECT}
      slateContent={[]}
      onContentClick={() => ({})}
      onMentionClick={() => ({})}
      onTagClick={() => ({})}
    />
  ),
};

export const BaseEntryCardLoadingPlaceholder: Story = {
  render: () => <EntryLoadingPlaceholder />,
};
