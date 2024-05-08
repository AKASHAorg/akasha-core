import type { Meta, StoryObj } from '@storybook/react';
import BubbleCard, { BubbleCardProps } from '../../components/BubbleCard';
import { editorDefaultValue } from '../../components/Editor/initialValue';

const meta: Meta<BubbleCardProps> = {
  title: 'DSComponents/Cards/BubbleCard',
  component: BubbleCard,
  tags: ['autodocs'],
  argTypes: {
    locale: { control: 'text' },
    senderName: { control: 'text' },
    youLabel: { control: 'text' },
    content: { control: 'object' },
    chatTimestamp: { control: 'text' },
  },
};

type Story = StoryObj<BubbleCardProps>;

export const Defult: Story = {
  args: {
    locale: 'en',
    senderName: 'Jerry Mil',
    youLabel: 'You',
    content: editorDefaultValue,
    chatTimestamp: '2022-06-16T10:07:15.000Z',
  },
};

export default meta;
