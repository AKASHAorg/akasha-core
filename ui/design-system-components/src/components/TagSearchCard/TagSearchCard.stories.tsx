import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import TagSearchCard, { TagSearchCardProps } from '.';
import { trendingTagsData } from '@akashaorg/design-system-core/lib/utils';

const meta: Meta<TagSearchCardProps> = {
  title: 'Cards/TagSearchCard',
  component: TagSearchCard,
};

export default meta;
type Story = StoryObj<TagSearchCardProps>;

export const BaseTagSearchCard: Story = {
  render: () => (
    <TagSearchCard
      tag={trendingTagsData[0]}
      subscribedTags={['Ethereum']}
      // mentionsLabel="posts"
      subscribeLabel="subscribe"
      subscribedLabel="subscribed"
      unsubscribeLabel="unsubscribe"
      tagAnchorLink="/@akashaorg/app-akasha-integration/tags"
      handleSubscribeTag={() => ({})}
      handleUnsubscribeTag={() => ({})}
    />
  ),
};
