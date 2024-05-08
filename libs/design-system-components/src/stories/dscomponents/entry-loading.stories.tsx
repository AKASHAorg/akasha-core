import type { Meta, StoryObj } from '@storybook/react';
import EntryLoading from '../../components/ProfileEngagements/placeholders/entry-loading';

const meta: Meta = {
  title: 'DSComponents/Loaders/Profile/EntryLoading',
  component: EntryLoading,
  tags: ['autodocs'],
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
