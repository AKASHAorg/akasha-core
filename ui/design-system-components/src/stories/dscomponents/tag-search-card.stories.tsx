import type { Meta, StoryObj } from '@storybook/react';
import { trendingTagsData } from '@akashaorg/design-system-core/lib/utils';
import TagSearchCard, { TagSearchCardProps } from '../../components/TagSearchCard';

const meta: Meta<TagSearchCardProps> = {
  title: 'DSComponents/Cards/TagSearchCard',
  component: TagSearchCard,
  tags: ['autodocs'],
  argTypes: {
    tag: { control: 'object' },
    subscribedTags: { control: 'object' },
    handleSubscribeTag: { action: 'tag subscribed' },
    handleUnsubscribeTag: { action: 'tag unsubscribed' },
  },
};

type Story = StoryObj<TagSearchCardProps>;

export const Default: Story = {
  args: {
    tag: trendingTagsData[0],
    subscribedTags: ['Ethereum'],
    subscribeLabel: 'subscribe',
    subscribedLabel: 'subscribed',
    unsubscribeLabel: 'unsubscribe',
    tagAnchorLink: '/@akashaorg/app-akasha-integration/tags',
    handleSubscribeTag: () => ({}),
    handleUnsubscribeTag: () => ({}),
  },
};

export default meta;
