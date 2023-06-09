import React from 'react';
import TagSearchCard, { ITagSearchCard } from '.';
import { trendingTagsData } from '@akashaorg/design-system-core/lib/utils/dummy-data';

export default {
  title: 'Cards/TagSearchCard',
  component: TagSearchCard,
  argType: {
    handleSubscribe: { action: 'clicked subscribe' },
    handleUnsubscribe: { action: 'clicked unsubscribe' },
  },
};

const Template = (args: ITagSearchCard) => (
  <div>
    <TagSearchCard {...args} />
  </div>
);

export const BaseTagSearchCard = Template.bind({});

BaseTagSearchCard.args = {
  tag: trendingTagsData[0],
  subscribedTags: ['Ethereum'],
  mentionsLabel: 'posts',
  subscribeLabel: 'subscribe',
  subscribedLabel: 'subscribed',
  unsubscribeLabel: 'unsubscribe',
  tagAnchorLink: '/@akashaorg/app-akasha-integration/tags',
};
