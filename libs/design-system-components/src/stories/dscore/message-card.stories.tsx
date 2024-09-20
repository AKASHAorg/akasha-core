import React from 'react';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import type { Meta, StoryObj } from '@storybook/react';
import MessageCard, {
  MessageCardProps,
} from '@akashaorg/design-system-core/lib/components/MessageCard';
import { ExclamationTriangleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

MessageCard.displayName = 'MessageCard';

const meta: Meta<MessageCardProps> = {
  title: 'DSCore/Cards/MessageCard',
  component: MessageCard,
  argTypes: {
    message: { control: 'text' },
    icon: { control: 'object' },
    background: { control: 'object' },
    customStyle: { control: 'text' },
  },
};

type Story = StoryObj<MessageCardProps>;

export const Default: Story = {
  args: {
    message: 'A sample message...',
  },
};

export const MessageCardWithIcon: Story = {
  args: {
    icon: (
      <Icon
        icon={<ExclamationTriangleIcon />}
        color={{ light: 'warningLight', dark: 'warningLight' }}
      />
    ),
    message: 'A sample message...',
    background: { light: 'warningDark/30', dark: 'warningDark/30' },
  },
};

export default meta;
