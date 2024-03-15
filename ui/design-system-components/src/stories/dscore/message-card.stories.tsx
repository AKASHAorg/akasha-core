import type { Meta, StoryObj } from '@storybook/react';
import MessageCard, {
  MessageCardProps,
} from '@akashaorg/design-system-core/lib/components/MessageCard';

const meta: Meta<MessageCardProps> = {
  title: 'DSCore/Cards/MessageCard',
  component: MessageCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    message: { control: 'text' },
    titleIcon: { control: 'object' },
    titleVariant: { control: 'text' },
    elevation: { control: 'text' },
    background: { control: 'text' },
    borderColor: { control: 'text' },
    customStyle: { control: 'text' },
    onClose: { action: 'card closed' },
  },
};

type Story = StoryObj<MessageCardProps>;

const baseArgs: Story = {
  args: {
    title: 'Title',
    elevation: '1',
    message: 'A sample message...',
  },
};

export const Default: Story = { args: { ...baseArgs.args } };

export default meta;
