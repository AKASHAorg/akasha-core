import type { Meta, StoryObj } from '@storybook/react';
import { trendingTagsData } from '@akashaorg/design-system-core/lib/utils';
import TagSearchCard, { TagSearchCardProps } from '../../components/TagSearchCard';

const meta: Meta<TagSearchCardProps> = {
  title: 'DSComponents/Cards/TagSearchCard',
  component: TagSearchCard,
  tags: ['autodocs'],
};

type Story = StoryObj<TagSearchCardProps>;

export const Default: Story = {
  args: {
    tag: trendingTagsData[0],
    subscribedTags: ['Ethereum'],
    subscribeLabel: 'subscribe',
    subscribedLabel: 'subscribed',
    unsubscribeLabel: 'unsubscribe',
    tagAnchorLink: '/@akashaorg/app-antenna/tags',
    handleSubscribeTag: () => ({}),
    handleUnsubscribeTag: () => ({}),
  },
};

export default meta;
