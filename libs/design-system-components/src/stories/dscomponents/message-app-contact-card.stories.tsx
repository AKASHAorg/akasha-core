import type { Meta, StoryObj } from '@storybook/react';
import MessageContactCard, { MessageContactCardProps } from '../../components/MessageContactCard';

const meta: Meta<MessageContactCardProps> = {
  title: 'DSComponents/Cards/MessageContactCard',
  component: MessageContactCard,
  tags: ['autodocs'],
  argTypes: {
    locale: { control: 'text' },
    senderName: { control: 'text' },
    content: { control: 'text' },
    isRead: { control: 'boolean' },
    isPinned: { control: 'boolean' },
    pinConvoLabel: { control: 'text' },
    unpinConvoLabel: { control: 'text' },
    senderAvatar: { control: 'object' },
    senderDid: { control: 'text' },
    transformSource: { action: 'source trnasformed' },
  },
};

type Story = StoryObj<MessageContactCardProps>;

const senderAvatar = { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } };

const senderDid = 'did:key:003410490050000320006570034567114572000';

const baseArgs: Story = {
  args: {
    locale: 'en',
    senderName: 'Jerry Mil',
    content: "Hello Jerry, I hope you're good and having a great day?",
    isRead: true,
    isPinned: false,
    pinConvoLabel: 'Pin',
    unpinConvoLabel: 'Unpin',
    senderAvatar,
    senderDid,
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
  },
};

export const Default: Story = {
  args: {
    ...baseArgs.args,
  },
};

export const UnreadContactCard: Story = {
  args: {
    ...baseArgs.args,
    isRead: false,
  },
};

export const PinnedContactCard: Story = {
  args: {
    ...baseArgs.args,
    isPinned: true,
  },
};

export default meta;
