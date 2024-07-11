import type { Meta, StoryObj } from '@storybook/react';
import EntryPublishErrorCard, {
  PublishErrorCardProps,
} from '../../components/Entry/EntryPublishErrorCard';

const meta: Meta<PublishErrorCardProps> = {
  title: 'DSComponents/Errors/EntryPublishErrorCard',
  component: EntryPublishErrorCard,
  tags: ['autodocs'],
};

type Story = StoryObj<PublishErrorCardProps>;

export const BaseEntryPublishErrorCard: Story = {
  args: {
    isCard: true,
    message: 'Sorry, an error occured!',
  },
};

export default meta;
